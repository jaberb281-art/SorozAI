const PRIVACY_SECTIONS = [
    {
        title: "Overview",
        body: [
            "This Privacy Policy is placeholder copy for the Zahirok AI prototype. It describes the kinds of information a music creation product may collect and how those practices should be finalized before launch.",
            "Zahirok AI is designed around Balochi music creation, community discovery, and user-controlled publishing.",
        ],
    },
    {
        title: "Information we collect",
        body: [
            "We may collect account information, profile details, prompts, lyrics, generated song metadata, usage events, device information, and support messages.",
            "If voice or audio upload features are enabled, uploaded files and related processing metadata may also be collected.",
        ],
    },
    {
        title: "How we use information",
        body: [
            "Information may be used to provide the app, save your creations, improve generation quality, maintain safety, prevent abuse, and support billing or account features.",
            "We may also use aggregated information to understand how creators use Zahirok AI and which features need improvement.",
        ],
    },
    {
        title: "Cookies and similar technologies",
        body: [
            "Cookies and similar technologies may be used for login sessions, security, product preferences, performance measurement, and optional marketing measurement.",
            "The Privacy Preference Center in the sidebar is a mock control and must be replaced with real consent management before launch.",
        ],
    },
    {
        title: "Voice/audio uploads",
        body: [
            "Voice and audio uploads can be sensitive. Final product rules should explain when uploads are stored, how long they are retained, and whether they are used to train or improve models.",
            "Users should only upload voice or audio material they have permission to use.",
        ],
    },
    {
        title: "AI-generated content",
        body: [
            "Prompts, lyrics, style tags, and generated outputs may be processed to create songs, improve product reliability, detect abuse, and provide user support.",
            "Final policy language should explain whether generated content is public, private, or used for model improvement.",
        ],
    },
    {
        title: "Sharing information",
        body: [
            "Information may be shared with service providers that help run hosting, analytics, payment processing, support, moderation, and security.",
            "Public songs, profiles, or comments may be visible to other users when community publishing is enabled.",
        ],
    },
    {
        title: "Data retention",
        body: [
            "Retention periods for account data, uploaded audio, generated songs, logs, and support requests must be finalized before launch.",
            "Users should have clear options to delete account data or remove published content where required by law and product policy.",
        ],
    },
    {
        title: "Your choices",
        body: [
            "You may be able to update account details, control published songs, manage cookie preferences, or request access and deletion through future support tools.",
            "Additional privacy rights may apply depending on where you live.",
        ],
    },
    {
        title: "Children's privacy",
        body: [
            "Zahirok AI is not intended for children unless a final product policy, age gate, and parental consent process are added.",
            "Final launch rules should clearly state age limits and regional requirements.",
        ],
    },
    {
        title: "Contact",
        body: [
            "For questions about this placeholder privacy policy, contact the Zahirok AI team through the support channel that will be listed before launch.",
        ],
    },
] as const

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#0b0b0c] px-5 py-10 text-sand md:px-10 md:py-14">
            {/* LEGAL_PLACEHOLDER: replace with lawyer-reviewed Privacy Policy before launch */}
            <article className="mx-auto max-w-[860px]">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron/78">Zahirok AI Legal</p>
                <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-5xl">Privacy Policy</h1>
                <p className="mt-4 text-sm font-semibold text-sand/52">Last Modified: June 1, 2026</p>
                <p className="mt-8 max-w-3xl text-base leading-8 text-sand/72">
                    This privacy page is draft placeholder copy for the Zahirok AI prototype. It is here so the product
                    has a readable legal area while final policy language is prepared.
                </p>

                <div className="mt-10 space-y-9">
                    {PRIVACY_SECTIONS.map((section) => (
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
