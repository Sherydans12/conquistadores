import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { getDocumentActionPresentation } from '../src/lib/cms/document-action.ts';
import { MANAGED_DOCUMENT_MIME_TYPES } from '../src/lib/cms/document-formats.ts';
import { fetchDirectusSnapshot } from '../src/lib/cms/directus.ts';
import {
  ENROLLMENT_DOCUMENTS_EMPTY_MESSAGE,
  getEnrollmentDocuments2027,
  loadDocumentCatalog,
  resolveDocumentsSource,
  RETIRED_DOCUMENT_SLUGS,
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
const enrollmentCategory = {
  ...category,
  id: '55555555-5555-4555-8555-555555555555',
  name: 'Matrículas',
  slug: 'matriculas',
  description: 'Matrículas y admisión',
  sort: 2,
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
const docxDocument = {
  ...documentBase,
  id: '88888888-8888-4888-8888-888888888888',
  title: 'Ficha de matrícula 2027',
  slug: 'ficha-matricula-2027',
  category: enrollmentCategory,
  school_year: 2027,
  file: {
    id: '99999999-9999-4999-8999-999999999999',
    filename_download: 'formularios/ficha-matricula-2027.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    filesize: '204800',
  },
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify({ data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function directusFetch(
  documents: unknown[] = [documentBase],
  categories: unknown[] = [category],
): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    const url = new URL(input.toString());
    if (url.pathname === '/items/document_categories') {
      return jsonResponse(categories);
    }
    if (url.pathname === '/items/documents') return jsonResponse(documents);
    return jsonResponse([], 404);
  }) as typeof fetch;
}

async function captureWarnings<T>(
  run: () => Promise<T>,
): Promise<{ result: T; warnings: unknown[][] }> {
  const originalWarn = console.warn;
  const warnings: unknown[][] = [];
  console.warn = (...values: unknown[]) => warnings.push(values);
  try {
    return { result: await run(), warnings };
  } finally {
    console.warn = originalWarn;
  }
}

test('el snapshot local es válido y deja 38 documentos activos', () => {
  const snapshot = assertDocumentSnapshot(snapshotJson);
  assert.ok(snapshot.documents.every(isPublishedPublic));
  assert.equal(
    snapshot.documents.filter(
      ({ slug }) => !RETIRED_DOCUMENT_SLUGS.has(slug),
    ).length,
    38,
  );
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

test('Matrículas 2027 incluye solo documentos published + public del año y categoría correctos', async () => {
  const enrollment2027 = {
    ...documentBase,
    id: '66666666-6666-4666-8666-666666666666',
    title: 'Documento público de Matrículas 2027',
    slug: 'matriculas-2027-publicado',
    category: enrollmentCategory,
    school_year: 2027,
  };
  const enrollment2026 = {
    ...enrollment2027,
    id: '77777777-7777-4777-8777-777777777777',
    title: 'Documento de Matrículas 2026',
    slug: 'matriculas-2026-publicado',
    school_year: 2026,
  };
  const excluded = [
    { ...enrollment2027, id: 'draft-2027', slug: 'draft-2027', status: 'draft' },
    { ...enrollment2027, id: 'review-2027', slug: 'review-2027', status: 'review' },
    {
      ...enrollment2027,
      id: 'hidden-2027',
      slug: 'hidden-2027',
      visibility: 'hidden',
    },
    {
      ...enrollment2027,
      id: 'archived-2027',
      slug: 'archived-2027',
      status: 'archived',
    },
  ];
  const catalog = await loadDocumentCatalog({
    environment: {
      CMS_DOCUMENTS_SOURCE: 'directus',
      CMS_URL: 'https://cms.example.com',
      CMS_STATIC_TOKEN: 'test-token-not-a-secret',
    },
    fetchImpl: directusFetch(
      [enrollment2027, enrollment2026, ...excluded],
      [category, enrollmentCategory],
    ),
  });

  assert.deepEqual(
    getEnrollmentDocuments2027(catalog).map(({ slug }) => slug),
    ['matriculas-2027-publicado'],
  );
  const currentDocument = getEnrollmentDocuments2027(catalog)[0];
  assert.deepEqual(
    getEnrollmentDocuments2027({
      ...catalog,
      documents: [
        currentDocument,
        {
          ...currentDocument,
          id: 'historical-display',
          slug: 'historical-display',
          status: 'historical',
        },
        {
          ...currentDocument,
          id: 'external-display',
          slug: 'external-display',
          status: 'external',
        },
      ],
    }).map(({ slug }) => slug),
    ['matriculas-2027-publicado'],
  );
  assert.equal(
    catalog.documents.some(({ slug }) => slug === 'matriculas-2026-publicado'),
    true,
  );
  assert.equal(
    catalog.documents.some(({ slug }) =>
      ['draft-2027', 'review-2027', 'hidden-2027', 'archived-2027'].includes(
        slug,
      ),
    ),
    false,
  );
});

test('Matrículas 2027 admite el estado vacío institucional', async () => {
  const catalog = await loadDocumentCatalog({
    environment: { CMS_DOCUMENTS_SOURCE: 'snapshot' },
  });

  assert.deepEqual(getEnrollmentDocuments2027(catalog), []);
  assert.equal(
    ENROLLMENT_DOCUMENTS_EMPTY_MESSAGE,
    'Los documentos de Matrículas 2027 se publicarán en esta sección cuando estén disponibles.',
  );
});

test('los documentos retirados se excluyen aunque Directus los entregue', async () => {
  const retiredDocument = {
    ...documentBase,
    id: '44444444-4444-4444-8444-444444444444',
    slug: 'horarios-2025',
    title: 'Horarios 2025',
  };
  const catalog = await loadDocumentCatalog({
    environment: {
      SITE_ENV: 'staging',
      CMS_DOCUMENTS_SOURCE: 'directus',
      CMS_URL: 'https://cms.example.com',
      CMS_STATIC_TOKEN: 'test-token-not-a-secret',
    },
    fetchImpl: directusFetch([documentBase, retiredDocument]),
  });
  assert.deepEqual(catalog.documents.map(({ slug }) => slug), [
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

test('la allowlist administrada contiene únicamente PDF y DOCX', () => {
  assert.deepEqual(Object.keys(MANAGED_DOCUMENT_MIME_TYPES).sort(), [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]);
});

test('PDF administrado conserva apertura, nombre y tamaño', async () => {
  const snapshot = await fetchDirectusSnapshot({
    cmsUrl: 'https://cms.example.com',
    token: 'test-token-not-a-secret',
    fetchImpl: directusFetch(),
    now: new Date('2026-07-30T12:00:00.000Z'),
  });
  const [document] = snapshot.documents;
  assert.equal(document.fileType, 'PDF');
  assert.equal(document.linkBehavior, 'open');
  assert.equal(document.fileName, 'reglamento-prueba.pdf');
  assert.equal(document.fileSize, '100 KB');
  assert.ok(!document.href.includes('?download'));
});

test('DOCX administrado genera descarga directa con filename seguro', async () => {
  const catalog = await loadDocumentCatalog({
    environment: {
      CMS_DOCUMENTS_SOURCE: 'directus',
      CMS_URL: 'https://cms.example.com',
      CMS_STATIC_TOKEN: 'test-token-not-a-secret',
    },
    fetchImpl: directusFetch([docxDocument], [enrollmentCategory]),
  });
  const [document] = catalog.documents;
  assert.equal(document.fileType, 'Word (DOCX)');
  assert.equal(document.linkBehavior, 'download');
  assert.equal(document.fileName, 'ficha-matricula-2027.docx');
  assert.equal(document.fileSize, '200 KB');
  assert.equal(
    document.href,
    'https://cms.example.com/assets/99999999-9999-4999-8999-999999999999/ficha-matricula-2027.docx?download',
  );
  assert.deepEqual(getDocumentActionPresentation(document), {
    label: 'Descargar formulario Word',
    download: 'ficha-matricula-2027.docx',
    accessibleHint: ' (formato Word DOCX)',
  });
});

test('DocumentCard vincula el comportamiento DOCX al atributo download', async () => {
  const source = await readFile(
    new URL('../src/components/documents/DocumentCard.astro', import.meta.url),
    'utf8',
  );
  assert.match(source, /download=\{action\.download\}/);
  assert.match(source, /getDocumentActionPresentation\(document\)/);
});

test('los DOCX 2027 alimentan /documentos/ y /matriculas-2027/', async () => {
  const catalog = await loadDocumentCatalog({
    environment: {
      CMS_DOCUMENTS_SOURCE: 'directus',
      CMS_URL: 'https://cms.example.com',
      CMS_STATIC_TOKEN: 'test-token-not-a-secret',
    },
    fetchImpl: directusFetch(
      [documentBase, docxDocument],
      [category, enrollmentCategory],
    ),
  });
  assert.equal(
    catalog.documents.some(({ slug }) => slug === docxDocument.slug),
    true,
  );
  assert.deepEqual(
    getEnrollmentDocuments2027(catalog).map(({ slug }) => slug),
    [docxDocument.slug],
  );
  const [documentsPage, enrollmentPage] = await Promise.all([
    readFile(new URL('../src/pages/documentos.astro', import.meta.url), 'utf8'),
    readFile(
      new URL('../src/pages/matriculas-2027.astro', import.meta.url),
      'utf8',
    ),
  ]);
  assert.match(documentsPage, /getEnrollmentDocuments2027\(catalog\)/);
  assert.match(enrollmentPage, /getEnrollmentDocuments2027\(catalog\)/);
});

test('servicios externos conservan apertura en pestaña nueva y aviso', async () => {
  const externalDocument = {
    ...documentBase,
    id: 'external-service',
    slug: 'certificados-mineduc',
    file: null,
    external_url: 'https://certificados.mineduc.cl/mvc/home/index',
  };
  const catalog = await loadDocumentCatalog({
    environment: {
      CMS_DOCUMENTS_SOURCE: 'directus',
      CMS_URL: 'https://cms.example.com',
      CMS_STATIC_TOKEN: 'test-token-not-a-secret',
    },
    fetchImpl: directusFetch([externalDocument]),
  });
  const [document] = catalog.documents;
  assert.equal(document.status, 'external');
  assert.equal(document.managedFile, false);
  assert.deepEqual(getDocumentActionPresentation(document), {
    label: 'Ver documento',
    target: '_blank',
    rel: 'noopener noreferrer',
    accessibleHint: ' (se abre fuera de este sitio)',
  });
});

test('DOCM, MIME desconocido y octet-stream se omiten sin bloquear un PDF válido', async () => {
  const invalidDocuments = [
    {
      ...docxDocument,
      id: 'docm',
      slug: 'formulario-docm',
      file: {
        ...docxDocument.file,
        filename_download: 'formulario.docm',
        type: 'application/vnd.ms-word.document.macroEnabled.12',
      },
    },
    {
      ...docxDocument,
      id: 'unknown',
      slug: 'formulario-desconocido',
      file: { ...docxDocument.file, type: 'application/x-unknown' },
    },
    {
      ...docxDocument,
      id: 'octet-stream',
      slug: 'formulario-octet-stream',
      file: { ...docxDocument.file, type: 'application/octet-stream' },
    },
  ];
  const { result, warnings } = await captureWarnings(() =>
    fetchDirectusSnapshot({
      cmsUrl: 'https://cms.example.com',
      token: 'test-token-not-a-secret',
      fetchImpl: directusFetch(
        [documentBase, ...invalidDocuments],
        [category, enrollmentCategory],
      ),
    }),
  );
  assert.deepEqual(result.documents.map(({ slug }) => slug), [documentBase.slug]);
  assert.equal(warnings.length, 4);
  assert.deepEqual(warnings.at(-1), [
    '[documentos] Resumen de documentos omitidos.',
    { omittedDocuments: 3, validDocuments: 1 },
  ]);
  assert.ok(
    warnings
      .slice(0, -1)
      .every(([, context]) =>
        JSON.stringify(context).includes('MIME administrado no permitido'),
      ),
  );
});

test('un nombre DOCM se rechaza incluso si Directus declara MIME DOCX', async () => {
  const macroFilename = {
    ...docxDocument,
    slug: 'macro-con-mime-docx',
    file: { ...docxDocument.file, filename_download: 'formulario.docm' },
  };
  const { result, warnings } = await captureWarnings(() =>
    fetchDirectusSnapshot({
      cmsUrl: 'https://cms.example.com',
      token: 'test-token-not-a-secret',
      fetchImpl: directusFetch(
        [documentBase, macroFilename],
        [category, enrollmentCategory],
      ),
    }),
  );
  assert.deepEqual(result.documents.map(({ slug }) => slug), [documentBase.slug]);
  assert.match(
    (warnings[0][1] as { cause: string }).cause,
    /formatos Word con macros no están permitidos/,
  );
});

test('documentos sin origen, con dos orígenes o con archivo no visible se omiten', async () => {
  const invalidDocuments = [
    { ...documentBase, id: 'no-origin', slug: 'sin-origen', file: null },
    {
      ...documentBase,
      id: 'two-origins',
      slug: 'dos-origenes',
      external_url: 'https://example.com/documento.pdf',
    },
    {
      ...documentBase,
      id: 'file-not-expanded',
      slug: 'archivo-no-visible',
      file: documentBase.file.id,
    },
  ];
  const { result, warnings } = await captureWarnings(() =>
    fetchDirectusSnapshot({
      cmsUrl: 'https://cms.example.com',
      token: 'test-token-not-a-secret',
      fetchImpl: directusFetch([documentBase, ...invalidDocuments]),
    }),
  );
  assert.deepEqual(result.documents.map(({ slug }) => slug), [documentBase.slug]);
  assert.equal(warnings.length, 4);
  const warningContexts = warnings.slice(0, -1).map(([, context]) => context);
  assert.deepEqual(
    warningContexts.map((context) => (context as { slug: string }).slug),
    ['sin-origen', 'dos-origenes', 'archivo-no-visible'],
  );
  assert.ok(!JSON.stringify(warnings).includes('test-token-not-a-secret'));
});

test('si todos los documentos publicados son inválidos el build se bloquea', async () => {
  const invalidDocument = { ...documentBase, file: null };
  const originalWarn = console.warn;
  console.warn = () => undefined;
  try {
    await assert.rejects(
      fetchDirectusSnapshot({
        cmsUrl: 'https://cms.example.com',
        token: 'test-token-not-a-secret',
        fetchImpl: directusFetch([invalidDocument]),
      }),
      /una lista vacía no puede publicarse/,
    );
  } finally {
    console.warn = originalWarn;
  }
});

test('una respuesta documental global no iterable continúa siendo fatal', async () => {
  const invalidFetch = (async (input: RequestInfo | URL) => {
    const url = new URL(input.toString());
    return url.pathname.includes('document_categories')
      ? jsonResponse([category])
      : jsonResponse({ invalid: true });
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

test('un HTTP no exitoso de Directus continúa siendo fatal', async () => {
  await assert.rejects(
    fetchDirectusSnapshot({
      cmsUrl: 'https://cms.example.com',
      token: 'test-token-not-a-secret',
      fetchImpl: (async () => jsonResponse([], 401)) as typeof fetch,
    }),
    /Directus respondió HTTP 401/,
  );
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
  assert.equal(catalog.documents.length, 38);
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

test('snapshot aprobado excluye horarios y ficha de matrícula retirados', async () => {
  const catalog = await loadDocumentCatalog({
    environment: {
      SITE_ENV: 'production',
      CMS_DOCUMENTS_SOURCE: 'snapshot',
      CMS_APPROVED_SNAPSHOT: 'true',
      CMS_URL: 'https://cms.colegioconquistadores.com',
    },
  });
  assert.equal(catalog.documents.length, 38);
  assert.equal(
    catalog.documents.some(({ slug }) => RETIRED_DOCUMENT_SLUGS.has(slug)),
    false,
  );
  assert.equal(
    catalog.categories.some(({ slug }) => slug === 'horarios'),
    false,
  );
});
