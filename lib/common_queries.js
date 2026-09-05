import { supabase } from "@/lib/supabaseServer";
import { data } from "autoprefixer";

// Returns a currently ongoing convention, if any
export async function getCurrentConvention() {
    return new Promise( async (resolve) => {
        const { data: foundConvention, error } = await supabase
        .from("conventions")
        .select("id, name, start_date, end_date")
        .order("start_date", { ascending: true })
        // .lt("start_date", new Date().toISOString())
        // .gt("end_date", new Date().toISOString())
        ;

      if (foundConvention?.length > 0) {
        resolve(foundConvention[0])
      }
      
    })
      
}