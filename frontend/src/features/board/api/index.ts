import { mockBoards, mockPosts, mockSystems } from '../mocks/mainPageData.ts'
import type { Board, BoardPost, SystemMenu } from '../types/index.ts'

export async function fetchBoards(): Promise<Board[]> {
  return mockBoards
}

export async function fetchPosts(): Promise<BoardPost[]> {
  return mockPosts
}

export async function fetchPost(boardId: string, postId: number): Promise<BoardPost | undefined> {
  return mockPosts.find(p => p.boardId === boardId && p.id === postId)
}

export async function fetchSystems(): Promise<SystemMenu[]> {
  return mockSystems
}
