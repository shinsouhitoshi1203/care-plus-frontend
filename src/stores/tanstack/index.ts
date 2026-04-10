import { QueryClient } from "@tanstack/react-query";
import { TANSTACK_QUERY_CONFIG } from "./config";

const tanstackClient = new QueryClient(TANSTACK_QUERY_CONFIG);

export default tanstackClient;
