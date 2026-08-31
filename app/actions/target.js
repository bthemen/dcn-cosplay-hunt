"use server";

import { approvalStatuses } from "@/lib/constants";
import { supabase } from "@/lib/supabaseServer";

/* Get the UID of a random fellow hunter */
export async function getNewTarget(conventionId, hunterId) {

    // TODO: Implement query that only considers records that are:
    // * not already in the logged captures
    // * not already in the target list of the current hunter
    /* Select all hunters not equal to the requesting hunter */
    const { data: candidateTargetIds, error } = await supabase
        .from("players")
        .select("app_uid")
        .eq("convention_id", conventionId)
        .eq("invisible", false)
        .eq("approved", approvalStatuses.APPROVED)
        .neq("app_uid", hunterId)

    console.log(candidateTargetIds);
    let index = Math.floor(Math.random() * candidateTargetIds.length)
    let target = candidateTargetIds[index]
    console.log("Chose", target)
    return target?.app_uid
}


// Returns only what a hunter is allowed to know about one of their targets —
// never the full player row (no code, no contact, no invisible/approved
// flags, no raw storage key). Photos are exposed as a stable link to
// /c/[conventionId]/player/[playerUid]/photo, which resolves the actual
// signed URL server-side, on demand, the first (and only) time it's
// requested — we never call createSignedUrl ourselves here.
export async function getTargetInformation(targetId, conventionId, hunterId) {
  // TODO: validate that (hunterId, targetId) is an active hunter/target pair
  // for this convention before returning anything — right now any target ID
  // is resolved unconditionally.
  const { data: targetData, error } = await supabase
    .from("players")
    .select("app_uid, character, series, description, name")
    .eq("convention_id", conventionId)
    .eq("app_uid", targetId)
    .single();

  if (error || !targetData) return null;

  return {
    id: targetData.app_uid,
    character: targetData.character,
    series: targetData.series,
    description: targetData.description,
    name: targetData.name,
    photoUrl: `/c/${conventionId}/player/${targetData.app_uid}/photo`,
  };
}
