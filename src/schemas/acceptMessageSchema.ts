import { z } from "zod";
// this is zod for input validation
export const AcceptMessageSchema = z.object({
    acceptMessages: z.boolean()
})