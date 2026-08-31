"use client"

import { supabase } from "@/lib/supabaseClient";

/* Generate a number that uniquely identifies a user within a convention context.
    Instead of relying on a stateful approach for this, simply fetch the current highest key, 
    and give the next number in line.
*/
export async function generate_app_uid(conventionId) {

    console.log("Looking for key for convention:", conventionId)
    return new Promise( async (resolve) => {
        const { data } = await supabase
        .from("players")
        .select("app_uid")
        .eq("convention_id", conventionId)
        .order("app_uid", { ascending: false })

        console.log(data)

        resolve(data.length == 0 ? 0 : parseInt(data[0]["app_uid"]) + 1)
    })
}