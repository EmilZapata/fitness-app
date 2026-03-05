import apiCall from "@core/axios";
import { Exercise } from "@core/toolbox/interfaces/exercise.interface";

export const getExercisesByBodyPart = (bodyPart: string) => {
  return apiCall<any, Exercise[]>({
    url: "/exercises/bodyPart/" + bodyPart,
    method: "GET",
  });
};
