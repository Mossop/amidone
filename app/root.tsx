import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";

import ConfigProvider from "./components/AppContext";
import { Config } from "./modules/config";

import "@shoelace-style/shoelace/dist/themes/light.css";
import "./styles/main.scss";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.14.0/cdn/",
);

const CONFIG: Config = {
  columns: 4,
  rows: 4,
  blockLayout: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  blocks: {
    "1": {
      title: "1",
      width: 2,
      height: 2,
    },
    "2": {
      title: "2",
      width: 1,
      height: 1,
    },
    "3": {
      title: "3",
      width: 3,
      height: 2,
    },
    "4": {
      title: "4",
      width: 1,
      height: 1,
    },
    "5": {
      title: "5",
      width: 1,
      height: 1,
    },
    "6": {
      title: "6",
      width: 1,
      height: 2,
    },
    "7": {
      title: "7",
      width: 1,
      height: 1,
    },
    "8": {
      title: "8",
      width: 1,
      height: 1,
    },
    "9": {
      title: "9",
      width: 1,
      height: 1,
    },
    "10": {
      title: "10",
      width: 1,
      height: 1,
    },
  },
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>Hello</header>
        <ConfigProvider config={CONFIG}>{children}</ConfigProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
