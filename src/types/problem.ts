// Parameter(s) for the solution function of a problem
export interface Parameter {
  name: string;
  type: string; // C-style e.g. "float", "int", "size_t", "uint64_t"
  const: string | boolean; // "true"/"false" or boolean from JSON problem definitions
  pointer: string | boolean; // "true"/"false" or boolean from JSON problem definitions
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  parameters: Parameter[];
}

export type DebugInfo = {
  max_difference?: number;
  mean_difference?: number;
  sample_differences?: Record<
    string,
    {
      expected: number;
      actual: number;
      diff: number;
    }
  >;
  message?: string;
};
