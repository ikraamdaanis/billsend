import { authComponent, createAuth } from "convex/auth";
import { httpRouter } from "convex/server";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

export default http;
