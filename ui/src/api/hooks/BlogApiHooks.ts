import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "../../contexts/ApiClientContext";

export const useGetArticleList = () => {
  const { apiClient } = useApiClient();
  return useQuery({
    queryKey: ["articleList"],
    queryFn: () => apiClient.article_Get(),
  });
};

export const useGetArticleBySlug = (slug: string) => {
  const { apiClient } = useApiClient();
  return useQuery({
    queryKey: ["articleBySlug", slug],
    queryFn: () => apiClient.article_Get2(slug),
  });
};
