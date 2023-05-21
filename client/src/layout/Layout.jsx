import { Helmet } from 'react-helmet'
import Header from './Header'
import { Toaster } from 'react-hot-toast'

const Layout = ({ children, title, description, keywords }) => {
    return (
        <>
            <Helmet>
                <meta charSet='utf-8' />
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <title>{title}</title>
            </Helmet>
            <Header />
            <Toaster />
            <main>
                {children}
            </main>
        </>
    )
}

Layout.defaultProps = {
    title: 'MERN Cloud',
    description: "MERN Cloud Application is fullstack web-app in which user can upload their photos, videos, docs, and many more things and can download whenever needed.",
    keywords: "Node, MongoDb, React, Express"
}

export default Layout