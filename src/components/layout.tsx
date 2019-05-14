import * as React from "react";
import { StaticQuery, graphql } from "gatsby";
import Helmet from "react-helmet";
import Header from "./header";

interface DefaultLayoutProps {
  title: string;
}

export const DefaultLayout: React.SFC<DefaultLayoutProps> = ({
  title,
  children
}) => (
  <StaticQuery
    query={graphql`
      query LayoutQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet
          titleTemplate={`%s | ${data.site.siteMetadata.title}`}
          defaultTitle={data.site.siteMetadata.title}
          title={title}
          meta={[
            { name: "description", content: "Sample" },
            { name: "keywords", content: "sample, something" }
          ]}
        />
        <Header />
        <main>{children}</main>
      </>
    )}
  />
);

export default DefaultLayout;
