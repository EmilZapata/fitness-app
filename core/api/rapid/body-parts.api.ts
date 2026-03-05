import apiCall from "@core/axios";
import { Exercise } from "@core/toolbox/interfaces/exercise.interface";

const EXERCISES_PAGE_LIMIT = 10;

export const getExercisesByBodyPart = (
  bodyPart: string,
  offset: number = 0,
) => {
  const encodedBodyPart = encodeURIComponent(bodyPart);
  return apiCall<any, Exercise[]>({
    url: `exercises1/GetExercisesByBodyparts?bodypart=${encodedBodyPart}&limit=${EXERCISES_PAGE_LIMIT}&offset=${offset}`,
    method: "POST",
  });
};

export { EXERCISES_PAGE_LIMIT };
