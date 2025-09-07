import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useApiClient } from "../../contexts/ApiClientContext";
import { CreateCommentRequest, ValidationStateDto } from "../client";

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
    staleTime: 1 * 60 * 1000,
  });
};

export const useGetComments = (articleId: string) => {
  const { apiClient } = useApiClient();
  return useQuery({
    queryKey: ["commentsByArticle", articleId],
    queryFn: () => apiClient.article_GetComments(articleId),
  });
};

type AddCommentParams = {
  articleId: string;
  parentCommentId: string | undefined;
  content: string;
};

export const useAddComment = (
  onSuccess: (result: ValidationStateDto) => void,
  onError: (error: string) => void
): UseMutationResult<ValidationStateDto, Error, AddCommentParams> => {
  const { apiClient } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, parentCommentId, content }: AddCommentParams) =>
      apiClient.article_CreateComment(
        new CreateCommentRequest({
          articleId,
          parentCommentId,
          content,
        })
      ),
    onSuccess: (result: ValidationStateDto) => {
      queryClient.invalidateQueries({ queryKey: ["commentsByArticle"] });
      onSuccess(result);
    },
    onError: (error: Error) => {
      onError(error.message);
    },
  });
};

type SetLikeParams = {
  entityId: string;
  isLiked: boolean;
};

export const useSetArticleLike = (
  onSuccess: (result: ValidationStateDto) => void,
  onError: (error: string) => void
): UseMutationResult<ValidationStateDto, Error, SetLikeParams> => {
  const { apiClient } = useApiClient();

  return useMutation({
    mutationFn: ({ entityId, isLiked }: SetLikeParams) =>
      apiClient.article_AddArticleLike(entityId, isLiked),
    onSuccess: (result: ValidationStateDto) => {
      onSuccess(result);
    },
    onError: (error: Error) => {
      onError(error.message);
    },
  });
};

export const useSetCommentLike = (
  onSuccess: (result: ValidationStateDto) => void,
  onError: (error: string) => void
): UseMutationResult<ValidationStateDto, Error, SetLikeParams> => {
  const { apiClient } = useApiClient();

  return useMutation({
    mutationFn: ({ entityId, isLiked }: SetLikeParams) =>
      apiClient.article_AddCommentLike(entityId, isLiked),
    onSuccess: (result: ValidationStateDto) => {
      onSuccess(result);
    },
    onError: (error: Error) => {
      onError(error.message);
    },
  });
};
