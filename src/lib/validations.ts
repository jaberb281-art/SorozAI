import { z } from "zod"

export const songRequestSchema = z
    .object({
        genrePreset: z.string().min(1, "Choose a genre preset"),
        instruments: z.array(z.string()).min(1, "Choose at least one instrument"),
        prompt: z.string(),
        lyrics: z.string(),
        instrumentalOnly: z.boolean(),
        isPublic: z.boolean(),
    })
    .superRefine((data, ctx) => {
        const songIdea = `${data.prompt} ${data.lyrics}`.trim()

        if (!data.instrumentalOnly && songIdea.length < 10) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["prompt"],
                message: "Write lyrics or describe the song idea",
            })
        }
    })

export type SongRequestFormValues = z.infer<typeof songRequestSchema>
