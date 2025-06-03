import { supabase } from "./supabaseClient";

type CommonResponse<TFull> = {
  data: TFull | null;
  error: Error | null;
};
type ListResponse<TFull> = {
  data: TFull[] | null;
  error: Error | null;
  count: number | null;
};
type UpdateorDeleteResponse = {
  status: number | null;
  error: Error | null;
};
export const createCrud = <TFull, TInsert extends object>(table: string) => {
  return {
    insert: async (payload: TInsert): Promise<CommonResponse<TFull>> => {
      try {
        const { data, error } = await supabase
          .from(table)
          .insert([payload])
          .select();
        if (error) throw error;
        return { data: data?.[0] ?? null, error: null };
      } catch (err) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error("Error inesperado"),
        };
      }
    },
    getAll: async ({
      from,
      to,
    }: {
      from: number;
      to: number;
    }): Promise<ListResponse<TFull>> => {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select("*", { count: "exact" })
          .range(from, to);
        if (error) throw error;
        return { data: data ?? [], error: null, count };
      } catch (err) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error("Error inesperado"),
          count: null,
        };
      }
    },
    getById: async ({ id }: { id: number }): Promise<CommonResponse<TFull>> => {
      try {
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .eq("id", id);
        if (error) throw error;
        return { data: data?.[0] ?? null, error: null };
      } catch (err) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error("Error inesperado"),
        };
      }
    },
    update: async ({
      id,
      values,
    }: {
      id: number;
      values: Partial<TFull>;
    }): Promise<UpdateorDeleteResponse> => {
      try {
        const { status, error } = await supabase
          .from(table)
          .update(values)
          .eq("id", id);
        if (error) throw error;
        return { status, error: null };
      } catch (err) {
        return {
          status: null,
          error: err instanceof Error ? err : new Error("Error inesperado"),
        };
      }
    },
    remove: async ({ id }: { id: number }): Promise<UpdateorDeleteResponse> => {
     try {
    const { status, error } = await supabase
      .from(table)
      .delete()
      .eq("id", id);
    if (error) throw error;
    return { status, error: null };
  } catch (err) {
    return {
      status: null,
      error: err instanceof Error ? err : new Error("Error inesperado"),
    };
  }
    },
  };
};
