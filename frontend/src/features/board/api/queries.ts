import { useQuery } from '@tanstack/react-query'
import * as api from './index.ts'

export function useBoards() {
  return useQuery({ queryKey: ['boards'], queryFn: api.fetchBoards })
}

export function usePosts() {
  return useQuery({ queryKey: ['posts'], queryFn: api.fetchPosts })
}

export function usePost(boardId: string | undefined, postId: number | undefined) {
  return useQuery({
    queryKey: ['post', boardId, postId],
    queryFn: () => api.fetchPost(boardId!, postId!),
    enabled: !!boardId && !!postId,
  })
}

export function useSystems() {
  return useQuery({ queryKey: ['systems'], queryFn: api.fetchSystems })
}
