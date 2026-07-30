import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchDirectusSnapshot } from '../src/lib/cms/directus.ts';
import {
  loadDocumentCatalog,
  resolveDocumentsSource,
} from '../src/lib/cms/documents.ts';
import {
  assertDocumentSnapshot,
  isPublishedPublic,
} from '../src/lib/cms/types.ts';
import snapshotJson from '../src/data/generated/documents.snapshot.json' with {
  type: 'json',
};

const category = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'Reglamentos',
  slug: 'reglamentos',
  description: 'Normativa',
  active: true,
  sort: 1,
};
const documentBase = {
  id: '22222222-2222-4222-8222-222222222222',
  title: 'Reglamento de prueba',
  slug: 'reglamento-prueba',
  description: 'Documento para probar la integración.',
  category,
  school_year: 2026,
  status: 'published',
  visibility: 'public',
  file: {
    id: '33333333-3333-4333-8333-333333333333',
    filename_download: 'reglamento-prueba.pdf',
    type: 'application/pdf',
    filesize: '102400',
  },
  external_url: null,
  audience: ['Comunidad educativa'],
  featured: true,
  keywords: ['reglamento'],
  sort: 1,
  published_at: '2026-07-30T12:00:00.000Z',
  expires_at: null,
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify({ data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function directusFetch(documents: unknown[] = [documentBase]): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    const url = new URL(input.toString());
    if (url.pathname === '/items/document_categories') {
      return jsonResponse([category]);
    }
    if (url.pathname === '/items/documents') return jsonResponse(documents);
    return jsonResponse([], 404);
  }) as typeof fetch;
}

test('el snapshot local es válido y contiene 39 documentos', () => {
  const snapshot = assertDocumentSnapshot(snapshotJson);
  assert.equal(snapshot.documents.length, 39);
  assert.ok(snapshot.documents.every(isPublishedPublic));
});

test('review, draft, hidden y archived quedan fuera', async () => {
  const excluded = [
    { ...documentBase, id: 'review', slug: 'review', status: 'review' },
    { ...documentBase, id: 'draft', slug: 'draft', status: 'draft' },
    {
      ...documentBase,
      id: 'hidden',
      slug: 'hidden',
      visibility: 'hidden',
    },
    { ...documentBase, id: 'archived', slug: 'archived', status: 'archived' },
  ];
  const snapshot = await fetchDirectusSnapshot({
    cmsUrl: 'https://cms.example.com',
    token: 'test-token-not-a-secret',
    fetchImpl: directusFetch([documentBase, ...excluded]),
    now: new Date('2026-07-30T12:00:00.000Z'),
  });
  assert.deepEqual(snapshot.documents.map(({ slug }) => slug), [
    'reglamento-prueba',
  ]);
});

test('una caída del CMS falla explícitamente', async () => {
  await assert.rejects(
    fetchDirectusSnapshot({
      cmsUrl: 'https://cms.example.com',
      token: 'test-token-not-a-secret',
      fetchImpl: (async () => {
        throw new TypeError('network unavailable');
      }) as typeof fetch,
    }),
    /network unavailable/,
  );
});

test('Directus exige token', async () => {
  await assert.rejects(
    loadDocumentCatalog({
      environment: {
        SITE_ENV: 'staging',
        CMS_DOCUMENTS_SOURCE: 'directus',
        CMS_URL: 'https://cms.example.com',
      },
      fetchImpl: directusFetch(),
    }),
    /CMS_STATIC_TOKEN es obligatorio/,
  );
});

test('una respuesta inválida no publica una lista vacía', async () => {
  const invalidFetch = (async (input: RequestInfo | URL) => {
    const url = new URL(input.toString());
    return url.pathname.includes('document_categories')
      ? jsonResponse({ invalid: true })
      : jsonResponse([]);
  }) as typeof fetch;
  await assert.rejects(
    fetchDirectusSnapshot({
      cmsUrl: 'https://cms.example.com',
      token: 'test-token-not-a-secret',
      fetchImpl: invalidFetch,
    }),
    /Respuesta inválida/,
  );
});

test('la URL estable del archivo no contiene token', async () => {
  const snapshot = await fetchDirectusSnapshot({
    cmsUrl: 'https://cms.example.com',
    token: 'test-token-not-a-secret',
    fetchImpl: directusFetch(),
    now: new Date('2026-07-30T12:00:00.000Z'),
  });
  assert.equal(
    snapshot.documents[0].href,
    'https://cms.example.com/assets/33333333-3333-4333-8333-333333333333/reglamento-prueba.pdf',
  );
  assert.ok(!snapshot.documents[0].href.includes('token'));
});

test('CI y desarrollo usan snapshot sin red', async () => {
  let requests = 0;
  const catalog = await loadDocumentCatalog({
    environment: { CI: 'true', SITE_ENV: 'staging' },
    fetchImpl: (async () => {
      requests += 1;
      throw new Error('no network expected');
    }) as typeof fetch,
  });
  assert.equal(catalog.documents.length, 39);
  assert.equal(requests, 0);
});

test('producción exige Directus o snapshot aprobado', () => {
  assert.throws(
    () => resolveDocumentsSource({ SITE_ENV: 'production' }),
    /Producción exige/,
  );
  assert.throws(
    () =>
      resolveDocumentsSource({
        SITE_ENV: 'production',
        CMS_DOCUMENTS_SOURCE: 'snapshot',
      }),
    /CMS_APPROVED_SNAPSHOT=true/,
  );
  assert.equal(
    resolveDocumentsSource({
      SITE_ENV: 'production',
      CMS_DOCUMENTS_SOURCE: 'snapshot',
      CMS_APPROVED_SNAPSHOT: 'true',
    }),
    'snapshot',
  );
});

test('snapshot aprobado admite rutas documentales locales con CMS_URL configurada', async () => {
  const catalog = await loadDocumentCatalog({
    environment: {
      SITE_ENV: 'production',
      CMS_DOCUMENTS_SOURCE: 'snapshot',
      CMS_APPROVED_SNAPSHOT: 'true',
      CMS_URL: 'https://cms.colegioconquistadores.com',
    },
  });
  const archive = catalog.documents.find(({ slug }) => slug === 'horarios-2025');
  assert.equal(
    archive?.href,
    '/documentos/?category=horarios&year=2025',
  );
  assert.equal(archive?.managedFile, false);
});
