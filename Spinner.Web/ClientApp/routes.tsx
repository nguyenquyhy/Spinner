import * as React from "react";
import Layout from "./components/Layout";
import { Route } from "react-router";
import Home from "./components/pages/Home";
import Room from "./components/pages/Room";
import Privacy from "./components/pages/Privacy";

export const routes = () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/rooms/:id' component={Room} />
        <Route path='/Privacy' component={Privacy} />
    </Layout>
);