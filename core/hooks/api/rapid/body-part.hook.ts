import { getExercisesByBodyPart } from "@core/api/rapid/body-parts.api";
import { useQuery } from "@tanstack/react-query";

export const useApiBodyPart = (bodyPart: string) => {
  return useQuery({
    queryKey: ["exercises", bodyPart],
    queryFn: () => getExercisesByBodyPart(bodyPart),
    enabled: !!bodyPart,
    staleTime: 1000 * 60 * 60, // 1 hour
    select: (data) => data.response, // Puedes transformar los datos aquí si es necesario
  });
};
