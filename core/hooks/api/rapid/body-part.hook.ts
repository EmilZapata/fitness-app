import {
  EXERCISES_PAGE_LIMIT,
  getExercisesByBodyPart,
} from "@core/api/rapid/body-parts.api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useApiBodyPart = (bodyPart: string) => {
  return useInfiniteQuery({
    queryKey: ["exercises", bodyPart],
    queryFn: ({ pageParam = 0 }) => getExercisesByBodyPart(bodyPart, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const exercises = lastPage.response;
      if (!exercises || exercises.length < EXERCISES_PAGE_LIMIT) {
        return undefined;
      }
      return allPages.length * EXERCISES_PAGE_LIMIT;
    },
    enabled: !!bodyPart,
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    select: (data) => data.pages.flatMap((page) => page.response ?? []),
  });
};
