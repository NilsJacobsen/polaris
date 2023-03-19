import fs from 'fs';
import ChildpageListing from '@/components/ChildpageListing';
import EditorRenderer from '@/components/EditorRenderer';
import Icons from '@/components/Icons';
import PropsTable from '@/components/PropsTable';
import TOC from '@/components/TOC';
import {content} from '@/content';
import {ResolvedPage, ResolvedPageWithBlocks} from '@/types';
import {getPageByPath, getResolvedPage, toPascalCase} from '@/utils';
import {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {JSONOutput} from 'typedoc';
import styles from './page.module.scss';
import page from '../examples/test/page';

async function loadPage(
  slug?: string[],
): Promise<ResolvedPageWithBlocks | undefined> {
  if (!slug) return undefined;
  const page = getPageByPath(content, slug.join('/'));
  if (page) {
    return getResolvedPage(content, page, true);
  } else {
    return notFound();
  }
}

async function loadChildPages(
  page: ResolvedPageWithBlocks,
): Promise<ResolvedPage[]> {
  if (page.layout === 'listing') {
    return content.pages
      .filter(({parentId}) => parentId === page.id)
      .map((page) => getResolvedPage(content, page));
  }
  return [];
}

async function loadProps(propName: string): Promise<{
  props: JSONOutput.DeclarationReflection | undefined;
  references: JSONOutput.DeclarationReflection[];
}> {
  const propsFile = fs.readFileSync('./.cache/props.json', 'utf8');
  const props = JSON.parse(propsFile) as JSONOutput.DeclarationReflection;

  let references: {[id: string]: JSONOutput.DeclarationReflection} = {};

  function findReferences(declaration: JSONOutput.DeclarationReflection) {
    function unpackType(type: JSONOutput.DeclarationReflection['type']) {
      if (type && type.type === 'reference' && type.id) {
        if (!references[type.id]) {
          const referencedDeclaration = props.children?.find(
            (child) => child.id === type.id,
          );
          if (referencedDeclaration) {
            references[type.id] = referencedDeclaration;
          }
        }
      } else if (type && type.type === 'array') {
        unpackType(type.elementType);
      } else if (type && type.type === 'union') {
        type.types.forEach((subType) => unpackType(subType));
      } else if (type && type.type === 'intersection') {
        type.types.forEach((subType) => unpackType(subType));
      }
    }

    unpackType(declaration.type);

    declaration.children?.forEach((child) => findReferences(child));
    declaration.signatures?.forEach((child) => findReferences(child));
  }
  props.children?.forEach((prop) => {
    findReferences(prop);
  });
  props.signatures?.forEach((prop) => {
    findReferences(prop);
  });

  const propsForComponent = props.children?.find(({name}) => name === propName);
  return {
    props: propsForComponent,
    references: Object.values(references),
  };
}

export async function generateMetadata({
  params,
}: {
  params: {slug: string[] | undefined};
}): Promise<Metadata> {
  if (!params.slug)
    return {
      title: 'Shopify Polaris',
      description: '',
    };

  const page = getPageByPath(content, params.slug.join('/'));
  if (page) {
    const title = `${page.title} — Shopify Polaris`;
    return {
      title,
      description: page.excerpt,
    };
  } else {
    return {};
  }
}

export default async function Home({params}: {params: {slug: string[]}}) {
  const {slug} = params;

  const page = await loadPage(slug);

  if (!page) {
    return (
      <PageWrapper title="Shopify Polaris" excerpt="" breadcrumbs={[]}>
        Home
      </PageWrapper>
    );
  }

  if (slug.join('/') === 'icons') {
    return (
      <PageWrapper
        title={page.title}
        excerpt={page.excerpt}
        breadcrumbs={page.breadcrumbs}
      >
        <Icons />
      </PageWrapper>
    );
  }

  const childPages = await loadChildPages(page);
  const props = await loadProps(toPascalCase(`${page.title}Props`));

  return (
    <PageWrapper
      title={page.title}
      excerpt={page.excerpt}
      breadcrumbs={page.breadcrumbs}
    >
      {/* <p style={{fontSize: 9}}>
        Website route {JSON.stringify({page})} {JSON.stringify({childPages})}
      </p> */}

      {page.pageMeta?.type === 'components' && (
        <>
          <p>Lifecycle phase: {page.pageMeta.lifeCyclePhase}</p>
          {page.pageMeta.examples.length > 0 && (
            <iframe
              style={{width: '100%', aspectRatio: '16/6', marginBottom: '3rem'}}
              src={`/examples/${page.pageMeta.examples[0].fileName.replace(
                '.tsx',
                '',
              )}`}
            ></iframe>
          )}
        </>
      )}

      <div className={styles.PageLayout}>
        <main>
          {page && (
            <>
              {page.pageMeta?.type === 'components' && (
                <PropsTable props={props.props} references={props.references} />
              )}

              {page.layout === 'listing' ? (
                <ChildpageListing pages={childPages} />
              ) : (
                <>
                  <EditorRenderer page={page} />
                </>
              )}
            </>
          )}
        </main>
        {page.layout === 'blocks' && (
          <aside>
            <TOC pageId={page.id} />
          </aside>
        )}
      </div>
    </PageWrapper>
  );
}

function PageWrapper({
  title,
  excerpt,
  breadcrumbs,
  children,
}: {
  title: string;
  excerpt: string;
  breadcrumbs: ResolvedPage['breadcrumbs'];
  children: React.ReactNode;
}) {
  let breadcrumbSlugs: string[] = [];
  return (
    <div className={styles.Page}>
      {breadcrumbs.length > 0 && (
        <ul className={styles.Breadcrumbs}>
          <Link href="">Home</Link>
          {breadcrumbs.map(({id, slug, title}) => {
            breadcrumbSlugs.push(slug);
            return (
              <Link key={id} href={breadcrumbSlugs.join('/')}>
                {title}
              </Link>
            );
          })}
        </ul>
      )}

      <h1>{title}</h1>
      <p>{excerpt}</p>

      {children}
    </div>
  );
}

// export async function generateStaticParams() {
//   const posts = await fetch('https://.../posts').then((res) => res.json());

//   return posts.map((post) => ({
//     slug: post.slug,
//   }));
// }
