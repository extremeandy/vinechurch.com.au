import * as React from "react";
import { Link, graphql } from "gatsby";
import DefaultLayout from "../components/layout";

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface IndexPageProps {
  data: {
    site: {
      siteMetadata: {
        title: string;
      };
    };
  };
}

export default class extends React.Component<IndexPageProps, {}> {
  constructor(props: IndexPageProps, context: any) {
    super(props, context);
  }
  public render() {
    // var result = typeof window !== "undefined" && prompt("LOL");
    // if (result == "LOL") {
    //   throw Error("OH NO");
    // }

    return (
      <DefaultLayout title="">
        <div>
          <h1 onClick={this.handleClick}>Hi people</h1>
          <p>
            Welcome to your new{" "}
            <strong>{this.props.data.site.siteMetadata.title}</strong> site.
          </p>
          <p>Now go build something great.</p>
          <Link to="/page-2/">Go to page 2</Link>
        </div>
      </DefaultLayout>
    );
  }

  handleClick() {
    fetch("/.netlify/functions/refresh-algolia-indexes")
      .then(response => response.json())
      .then(console.log)
      .catch(error => console.error(error));
  }
}

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
