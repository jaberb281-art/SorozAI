type AuthCardProps = {
  children: React.ReactNode
  subtitle: string
  title: string
}

export function AuthCard({ children, subtitle, title }: AuthCardProps) {
  return (
    <section className="rounded-[2rem] border border-sand/15 bg-sand/10 p-2.5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
      <div className="rounded-[1.45rem] border border-sand/10 bg-charcoal/55 p-5">
        <h1 className="text-3xl font-black leading-tight text-sand sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2.5 text-sm leading-6 text-sand/78">{subtitle}</p>
        {children}
      </div>
    </section>
  )
}
