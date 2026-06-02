const TERMS_SECTIONS = [
    {
        title: "Overview",
        body: [
            "These Terms of Service are placeholder terms for Zahirok AI, a music creation experience focused on Balochi-inspired sounds, lyrics, and community sharing.",
            "By using the product, you agree to use Zahirok AI responsibly and to follow any product limits, community rules, and plan restrictions shown in the app.",
        ],
    },
    {
        title: "Using Zahirok AI",
        body: [
            "Zahirok AI lets users draft lyrics, generate mock song ideas, organize music, and explore Balochi music themes. Some features may be experimental, unavailable, or changed before launch.",
            "You are responsible for the prompts, lyrics, audio, metadata, and other material you submit to the service.",
        ],
    },
    {
        title: "Accounts and access",
        body: [
            "You may need an account to access creation tools, save songs, publish to community areas, or manage a subscription.",
            "Keep your account credentials secure. If you believe someone has accessed your account without permission, contact the Zahirok AI team.",
        ],
    },
    {
        title: "User content",
        body: [
            "You retain responsibility for content you upload or enter, including lyrics, voice clips, prompts, cover art, and song descriptions.",
            "Do not upload content that you do not have permission to use, or content that violates another person's rights, privacy, or safety.",
        ],
    },
    {
        title: "AI-generated music",
        body: [
            "AI-generated music may be influenced by prompts, settings, model behavior, and mock product rules. Outputs may be imperfect, unexpected, or similar to other generated material.",
            "Rights for generated music, commercial use, attribution, and publishing permissions must be finalized before launch.",
        ],
    },
    {
        title: "Payments and subscriptions",
        body: [
            "Plan names, song limits, credits, and pricing shown in this prototype are placeholder product terms unless confirmed in a final checkout experience.",
            "Subscription billing, refunds, add-on credits, and payment provider terms will need final product and legal review before launch.",
        ],
    },
    {
        title: "Prohibited use",
        body: [
            "Do not use Zahirok AI to create unlawful, abusive, deceptive, infringing, exploitative, or harmful content.",
            "Do not attempt to bypass product limits, scrape private data, interfere with the service, or misuse another user's content.",
        ],
    },
    {
        title: "Termination",
        body: [
            "Access may be suspended or terminated if an account violates these placeholder terms, harms the service, or creates risk for other users.",
            "Users may stop using the service at any time. Account deletion, export, and retention rules need final implementation before launch.",
        ],
    },
    {
        title: "Disclaimers",
        body: [
            "This prototype is provided for design and product exploration. Zahirok AI does not guarantee uninterrupted availability, exact output quality, or suitability for a particular use.",
            "Final legal disclaimers, warranties, liability limits, and jurisdiction terms must be prepared by qualified counsel.",
        ],
    },
    {
        title: "Contact",
        body: [
            "For questions about these placeholder terms, contact the Zahirok AI team through the support channel that will be listed before launch.",
        ],
    },
] as const

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#0b0b0c] px-5 py-10 text-sand md:px-10 md:py-14">
            {/* LEGAL_PLACEHOLDER: replace with lawyer-reviewed Terms of Service before launch */}
            <article className="mx-auto max-w-[860px]">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron/78">Zahirok AI Legal</p>
                <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-5xl">Terms of Service</h1>
                <p className="mt-4 text-sm font-semibold text-sand/52">Last Modified: June 1, 2026</p>
                <p className="mt-8 max-w-3xl text-base leading-8 text-sand/72">
                    These terms are draft placeholder copy for the Zahirok AI prototype. They are written to support
                    product design and should not be treated as final legal terms.
                </p>

                <div className="mt-10 space-y-9">
                    {TERMS_SECTIONS.map((section) => (
                        <section key={section.title} className="border-t border-white/10 pt-7">
                            <h2 className="text-2xl font-black text-white">{section.title}</h2>
                            <div className="mt-4 space-y-4 text-[15px] leading-8 text-sand/68">
                                {section.body.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </article>
        </main>
    )
}
