import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>SPICE UK INTERGROUP BILLING AND COMMISSIONS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Welcome to your new module!" />
        <h1>Spice InterGroup Billing and Commissions Module</h1>
        <p className="description">
        </p>
      </main>

      <Footer />
    </div>
  )
}
