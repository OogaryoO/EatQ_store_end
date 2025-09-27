import Head from 'next/head'

export default function Layout({ children, title = 'EatQ Store' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="EatQ Store - PWA Management System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="layout">
        {children}
      </div>
    </>
  )
}