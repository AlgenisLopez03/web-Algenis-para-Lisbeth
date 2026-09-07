import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import './App.css'

const START_DATE = new Date(2019, 10, 29, 0, 0, 0)
const CAPSULE_UNLOCK_DATE = new Date(2026, 10, 29, 0, 0, 0)

type ElapsedTime = {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

type CropPhotoProps = {
  file: string
  x: number
  y: number
  width: number
  height: number
  alt: string
  rotation?: number
  className?: string
}

type SkyMemory = {
  title: string
  text: string
  photo?: CropPhotoProps
}

type CapsuleCountdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
  unlocked: boolean
}

const vouchers = [
  'Vale por un beso',
  'Vale por un abrazo fuerte',
  'Vale por una cena romántica',
  'Vale por la película que tú elijas',
  'Vale por desayuno en la cama',
  'Vale por postre doble',
  'Vale por un viaje sorpresa',
]

const voucherMessages = [
  'Este vale se convierte en un beso largo, sin prisa y con todo mi amor.',
  'Tienes reservado un abrazo de esos que calman el mundo y se sienten como hogar.',
  'Hoy la mesa es para dos: una cena especial, conversación bonita y todas mis miradas para ti.',
  'Tú eliges la película; yo pongo los abrazos, la compañía y algo rico para compartir.',
  'Desayuno preparado con cariño, servido con una sonrisa y un beso de buenos días.',
  'Un postre para cada uno… o uno doble para compartir cucharada a cucharada.',
  'Una aventura sorpresa juntos, con destino secreto y recuerdos nuevos por crear.',
]

const plans = [
  'Viajar juntos',
  'Ver el amanecer',
  'Una escapada de fin de semana',
  'Cocinar juntos',
  'Ir a un concierto',
]

const wheelOptions = ['Sorpresa', 'Cena', 'Cine', 'Helado', 'Picnic', 'Baile']

const wheelMessages: Record<string, string> = {
  Sorpresa: 'Prepara un pequeño detalle inesperado para el otro y entrégalo con un beso.',
  Cena: 'Elijan una cena especial: uno escoge el lugar y el otro el postre.',
  Cine: 'Hoy toca película juntos, abrazados y sin mirar el teléfono.',
  Helado: 'Vayan por un helado y cada uno debe elegir el sabor del otro.',
  Picnic: 'Planeen un picnic en su lugar favorito con música y algo rico para compartir.',
  Baile: 'Pongan su canción y bailen juntos, aunque sea en medio de la sala.',
}

const skyMemories: SkyMemory[] = [
  {
    title: 'Nuestro comienzo',
    text: 'Desde aquel primer momento, algo en mí supo que nuestra historia sería diferente.',
    photo: {
      file: 'screen-01.png',
      x: 54,
      y: 257,
      width: 274,
      height: 338,
      alt: 'Algenis y Lisbeth abrazados',
      rotation: -1.5,
    },
  },
  {
    title: 'Tu abrazo',
    text: 'En tus brazos encontré mi lugar favorito: ese donde todo se calma y siempre quiero volver.',
  },
  {
    title: 'Los dos contra el mundo',
    text: 'Cada aventura contigo se convierte en una historia que quiero recordar para siempre.',
    photo: {
      file: 'screen-02.png',
      x: 54,
      y: 346,
      width: 269,
      height: 337,
      alt: 'Algenis y Lisbeth frente al espejo',
      rotation: 1.2,
    },
  },
  {
    title: 'Nuestro primer beso',
    text: 'El instante en que el tiempo se detuvo y comenzó una parte inolvidable de nosotros.',
  },
  {
    title: 'Lo que nadie ve',
    text: 'Las miradas cómplices, las risas sin explicación y esos pequeños momentos que solo entendemos tú y yo.',
    photo: {
      file: 'screen-08.png',
      x: 52,
      y: 27,
      width: 271,
      height: 330,
      alt: 'Un recuerdo de juventud de Algenis y Lisbeth',
      rotation: -1.3,
    },
  },
  {
    title: 'Siempre tú',
    text: 'Entre todos los caminos posibles, volvería a elegir el que me lleva hasta ti.',
  },
]

const starPositions = [
  { left: '15%', top: '24%', delay: '-0.4s' },
  { left: '48%', top: '12%', delay: '-1.7s' },
  { left: '77%', top: '28%', delay: '-0.9s' },
  { left: '27%', top: '58%', delay: '-2.2s' },
  { left: '63%', top: '63%', delay: '-1.2s' },
  { left: '84%', top: '76%', delay: '-2.8s' },
]

function getElapsedTime(now: Date): ElapsedTime {
  let years = now.getFullYear() - START_DATE.getFullYear()
  let cursor = new Date(START_DATE)
  cursor.setFullYear(START_DATE.getFullYear() + years)

  if (cursor > now) {
    years -= 1
    cursor = new Date(START_DATE)
    cursor.setFullYear(START_DATE.getFullYear() + years)
  }

  let months = 0
  while (months < 11) {
    const nextMonth = new Date(cursor)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    if (nextMonth > now) break
    cursor = nextMonth
    months += 1
  }

  const remaining = Math.max(0, now.getTime() - cursor.getTime())
  const days = Math.floor(remaining / 86_400_000)
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000)
  const minutes = Math.floor((remaining % 3_600_000) / 60_000)
  const seconds = Math.floor((remaining % 60_000) / 1_000)

  return { years, months, days, hours, minutes, seconds }
}

function useAnniversaryClock() {
  const [time, setTime] = useState(() => getElapsedTime(new Date()))

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getElapsedTime(new Date())), 1_000)
    return () => window.clearInterval(timer)
  }, [])

  return time
}

function getCapsuleCountdown(now: Date): CapsuleCountdown {
  const remaining = Math.max(0, CAPSULE_UNLOCK_DATE.getTime() - now.getTime())

  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining % 86_400_000) / 3_600_000),
    minutes: Math.floor((remaining % 3_600_000) / 60_000),
    seconds: Math.floor((remaining % 60_000) / 1_000),
    unlocked: remaining === 0,
  }
}

function useCapsuleCountdown() {
  const [countdown, setCountdown] = useState(() => getCapsuleCountdown(new Date()))

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCapsuleCountdown(new Date())), 1_000)
    return () => window.clearInterval(timer)
  }, [])

  return countdown
}

function CropPhoto({
  file,
  x,
  y,
  width,
  height,
  alt,
  rotation = 0,
  className = '',
}: CropPhotoProps) {
  const frameStyle = {
    aspectRatio: `${width} / ${height}`,
    '--photo-rotation': `${rotation}deg`,
  } as CSSProperties

  return (
    <figure className={`crop-photo ${className}`} style={frameStyle}>
      <div className="crop-photo__viewport">
        <img
          src={`/memories/${file}`}
          alt={alt}
          draggable="false"
          loading="lazy"
          style={{
            width: `${(402 / width) * 100}%`,
            left: `${(-x / width) * 100}%`,
            top: `${(-y / height) * 100}%`,
          }}
        />
      </div>
    </figure>
  )
}

function SectionHeading({ eyebrow, children, id }: { eyebrow: string; children: React.ReactNode; id?: string }) {
  return (
    <header className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{children}</h2>
    </header>
  )
}

function App() {
  const elapsed = useAnniversaryClock()
  const capsuleCountdown = useCapsuleCountdown()
  const [storyOpened, setStoryOpened] = useState(false)
  const [letterOpen, setLetterOpen] = useState(false)
  const [redeemed, setRedeemed] = useState<number[]>(() => {
    try {
      const savedVouchers = window.localStorage.getItem('algenis-lisbeth-redeemed-vouchers')
      if (!savedVouchers) return []
      const parsedVouchers: unknown = JSON.parse(savedVouchers)
      return Array.isArray(parsedVouchers)
        ? parsedVouchers.filter((value): value is number => Number.isInteger(value) && value >= 0 && value < vouchers.length)
        : []
    } catch {
      return []
    }
  })
  const [activeVoucher, setActiveVoucher] = useState<number | null>(null)
  const [voucherResetNotice, setVoucherResetNotice] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [wheelResult, setWheelResult] = useState('')
  const [wheelRevealOpen, setWheelRevealOpen] = useState(false)
  const [activePlace, setActivePlace] = useState<'met' | 'kiss' | null>(null)
  const [activeMemory, setActiveMemory] = useState<number | null>(null)
  const [capsuleOpen, setCapsuleOpen] = useState(false)

  const floatingHearts = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => ({
        left: `${(index * 37) % 94 + 3}%`,
        delay: `${(index % 10) * -1.35}s`,
        duration: `${9 + (index % 6) * 1.25}s`,
        size: `${7 + (index % 4) * 2}px`,
        sway: `${-18 + (index % 5) * 9}px`,
      })),
    [],
  )

  useEffect(() => {
    try {
      window.localStorage.setItem('algenis-lisbeth-redeemed-vouchers', JSON.stringify(redeemed))
    } catch {
      // The voucher still works even when private browsing blocks local storage.
    }
  }, [redeemed])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setActiveVoucher(null)
      setWheelRevealOpen(false)
      setActiveMemory(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const redeemVoucher = (index: number) => {
    if (redeemed.includes(index)) return
    setRedeemed((current) => [...current, index])
    setActiveVoucher(index)
  }

  const resetVouchers = () => {
    setRedeemed([])
    setActiveVoucher(null)
    setVoucherResetNotice(true)
    window.setTimeout(() => setVoucherResetNotice(false), 3_000)
  }

  const spinWheel = () => {
    if (spinning) return
    const selected = Math.floor(Math.random() * wheelOptions.length)
    const extraRotation = 1_440 + (360 - selected * 60 - 30)
    setSpinning(true)
    setWheelResult('')
    setRotation((current) => current + extraRotation)
    window.setTimeout(() => {
      setWheelResult(wheelOptions[selected])
      setWheelRevealOpen(true)
      setSpinning(false)
    }, 3_250)
  }

  return (
    <main className="story">
      <div className="ambient-hearts" aria-hidden="true">
        {floatingHearts.map((heart, index) => (
          <span
            key={index}
            style={
              {
                '--heart-left': heart.left,
                '--heart-delay': heart.delay,
                '--heart-duration': heart.duration,
                '--heart-size': heart.size,
                '--heart-sway': heart.sway,
              } as CSSProperties
            }
          >
            ♥
          </span>
        ))}
      </div>

      {!storyOpened ? (
        <section className="cover-section section-shell" aria-label="Portada de Algenis y Lisbeth">
          <img
            className="cover-art"
            src="/og.png"
            alt="Algenis y Lisbeth, nuestra historia"
            loading="eager"
            fetchPriority="high"
          />
          <button className="cover-button" type="button" onClick={() => setStoryOpened(true)}>
            Abrir nuestra historia <span aria-hidden="true">♥</span>
          </button>
        </section>
      ) : (
        <div className="story-content">
      <section id="story-start" className="hero-section section-shell" aria-labelledby="main-title">
        <p className="hero-kicker">Nuestra historia</p>
        <h1 id="main-title">
          <span>Algenis <em>&amp;</em></span>
          <span>Lisbeth</span>
        </h1>
        <CropPhoto
          file="screen-01.png"
          x={54}
          y={257}
          width={274}
          height={338}
          alt="Algenis y Lisbeth abrazados"
          rotation={-2.4}
          className="hero-photo"
        />
        <div className="scroll-cue" aria-hidden="true">
          <span />
          Sigue bajando
        </div>
      </section>

      <section className="section-shell anniversary-section" aria-labelledby="anniversary-title">
        <div className="glass-card anniversary-card">
          <p id="anniversary-title" className="script intro-script">Juntos desde hace</p>
          <p className="anniversary-main" aria-live="polite">
            {elapsed.years} años, {elapsed.months} meses y<br />
            {elapsed.days} días
          </p>
          <p className="anniversary-clock">
            <span>{String(elapsed.hours).padStart(2, '0')}h</span>
            <span>{String(elapsed.minutes).padStart(2, '0')}m</span>
            <span>{String(elapsed.seconds).padStart(2, '0')}s</span>
          </p>
        </div>
        <CropPhoto
          file="screen-02.png"
          x={54}
          y={346}
          width={269}
          height={337}
          alt="Algenis y Lisbeth frente al espejo"
          rotation={1.8}
        />
      </section>

      <section className="section-shell video-section" aria-labelledby="song-title">
        <SectionHeading eyebrow="Nuestra canción" id="song-title">Un recuerdo que siempre suena</SectionHeading>
        <div className="video-frame">
          <iframe
            src="https://www.youtube-nocookie.com/embed/KtlgYxa6BMU?rel=0"
            title="Lord Huron — The Night We Met"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </section>

      <section className="section-shell letter-section" aria-labelledby="letter-title">
        <div className={`love-letter ${letterOpen ? 'is-open' : ''}`}>
          {!letterOpen ? (
            <>
              <p className="eyebrow" id="letter-title">Mensaje privado</p>
              <span className="seal" aria-hidden="true">♥</span>
              <button className="outline-button" type="button" onClick={() => setLetterOpen(true)}>
                Abrir carta
              </button>
            </>
          ) : (
            <div className="letter-copy">
              <p className="script" id="letter-title">
                Eres lo mejor que me ha pasado. Cada día a tu lado es un regalo, y te elijo a ti,
                todos los días, para siempre.
              </p>
              <p className="eyebrow">Con amor</p>
              <p className="script signature">Algenis</p>
              <button className="outline-button" type="button" onClick={() => setLetterOpen(false)}>
                Cerrar
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="section-shell memories-section" aria-label="Nuestros recuerdos">
        <CropPhoto
          file="screen-05.png"
          x={49}
          y={20}
          width={268}
          height={331}
          alt="Collage de recuerdos de Algenis y Lisbeth"
          rotation={-1.6}
        />

        <div className="glass-card reasons-card">
          <h2 className="script">Lo que más amo de Lisbeth</h2>
          <ul>
            <li>Tu sonrisa boba por la mañana</li>
            <li>Tu valentía para seguir tus sueños</li>
            <li>Tu paciencia infinita conmigo</li>
            <li>Tu forma de cuidar a los demás</li>
            <li>Tu mirada cuando te concentras</li>
            <li>Tu risa contagiosa</li>
            <li>Tu abrazo fuerte</li>
            <li>El brillo en tus ojos cuando hablas de lo que amas</li>
          </ul>
        </div>

        <CropPhoto
          file="screen-06.png"
          x={61}
          y={321}
          width={263}
          height={333}
          alt="Algenis y Lisbeth compartiendo un beso"
          rotation={2.1}
        />
      </section>

      <section className="section-shell places-section" aria-labelledby="places-title">
        <div className="glass-card map-card">
          <SectionHeading eyebrow="Dónde empezó todo" id="places-title">Nuestros lugares</SectionHeading>
          <div className="map-wrap">
            <img
              src="/memories/screen-07.png"
              alt="Mapa de nuestros lugares en Santa Cruz de la Sierra"
              loading="lazy"
            />
            <button
              className={`map-hotspot map-hotspot--met ${activePlace === 'met' ? 'is-active' : ''}`}
              type="button"
              aria-label="Dónde nos conocimos"
              aria-expanded={activePlace === 'met'}
              onClick={() => setActivePlace(activePlace === 'met' ? null : 'met')}
            >
              <span>Dónde nos conocimos</span>
            </button>
            <button
              className={`map-hotspot map-hotspot--kiss ${activePlace === 'kiss' ? 'is-active' : ''}`}
              type="button"
              aria-label="El primer beso"
              aria-expanded={activePlace === 'kiss'}
              onClick={() => setActivePlace(activePlace === 'kiss' ? null : 'kiss')}
            >
              <span>El primer beso</span>
            </button>
          </div>
          <a
            className="map-link"
            href="https://www.openstreetmap.org/#map=15/-17.7807/-63.1840"
            target="_blank"
            rel="noreferrer"
          >
            Abrir el mapa completo
          </a>
        </div>

        <CropPhoto
          file="screen-08.png"
          x={52}
          y={27}
          width={271}
          height={330}
          alt="Un recuerdo de juventud de Algenis y Lisbeth"
          rotation={-1.9}
        />

        <div className="glass-card bucket-card">
          <SectionHeading eyebrow="Cosas que quiero hacer contigo">Nuestra lista</SectionHeading>
          <ul>
            {plans.map((plan) => (
              <li key={plan}><span aria-hidden="true">✣</span>{plan}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-shell sky-section" aria-labelledby="sky-title">
        <SectionHeading eyebrow="Secretos entre estrellas" id="sky-title">Cielo de recuerdos</SectionHeading>
        <p className="section-description">Toca las seis estrellas doradas y descubre los momentos que guardé para ti.</p>
        <div className="memory-sky" aria-label="Seis recuerdos escondidos en las estrellas">
          <span className="shooting-star" aria-hidden="true" />
          {skyMemories.map((memory, index) => {
            const position = starPositions[index]
            const isActive = activeMemory === index
            return (
              <button
                className={`memory-star ${isActive ? 'is-active' : ''}`}
                style={
                  {
                    '--star-left': position.left,
                    '--star-top': position.top,
                    '--star-delay': position.delay,
                  } as CSSProperties
                }
                type="button"
                key={memory.title}
                aria-label={`Descubrir: ${memory.title}`}
                aria-pressed={isActive}
                onClick={() => setActiveMemory(isActive ? null : index)}
              >
                <span aria-hidden="true">✦</span>
              </button>
            )
          })}
          <p className="sky-hint" aria-hidden="true">Cada estrella guarda un pedacito de nosotros</p>
        </div>
        <div className={`memory-reveal ${activeMemory !== null ? 'has-memory' : ''}`} aria-live="polite">
          {activeMemory === null ? (
            <p className="memory-placeholder"><span aria-hidden="true">✦</span> Elige una estrella para revelar su secreto</p>
          ) : (
            <article key={skyMemories[activeMemory].title}>
              <div className="memory-copy">
                <p className="eyebrow">Recuerdo secreto {activeMemory + 1} de {skyMemories.length}</p>
                <h3>{skyMemories[activeMemory].title}</h3>
                <p>{skyMemories[activeMemory].text}</p>
                <button type="button" onClick={() => setActiveMemory(null)}>Guardar recuerdo</button>
              </div>
              {skyMemories[activeMemory].photo && (
                <CropPhoto {...skyMemories[activeMemory].photo} className="sky-memory-photo" />
              )}
            </article>
          )}
        </div>
      </section>

      <section className="section-shell voucher-section" aria-labelledby="voucher-title">
        <SectionHeading eyebrow="Solo para ti" id="voucher-title">Nuestros vales de amor</SectionHeading>
        <p className="section-description">Canjéalos cuando quieras. Pero cada vale solo se puede usar una vez.</p>
        <button className="voucher-reset" type="button" onClick={resetVouchers} disabled={redeemed.length === 0}>
          <span aria-hidden="true">↻</span> Reiniciar vales
        </button>
        <p className={`voucher-reset-notice ${voucherResetNotice ? 'is-visible' : ''}`} aria-live="polite">
          {voucherResetNotice ? 'Todos los vales vuelven a estar disponibles ♥' : ''}
        </p>
        <div className="voucher-list">
          {vouchers.map((voucher, index) => {
            const isRedeemed = redeemed.includes(index)
            return (
              <article className={`voucher ${isRedeemed ? 'is-redeemed' : ''}`} key={voucher}>
                <span className="voucher-heart" aria-hidden="true">♥</span>
                <div className="voucher-copy">
                  <span>Vale</span>
                  <h3>{voucher}</h3>
                </div>
                <button type="button" disabled={isRedeemed} onClick={() => redeemVoucher(index)}>
                  {isRedeemed ? 'Canjeado' : 'Canjear'}
                </button>
              </article>
            )
          })}
        </div>
      </section>

      <section className="section-shell wheel-section" aria-labelledby="wheel-title">
        <SectionHeading eyebrow="Para ti" id="wheel-title">La ruleta tiene una pregunta</SectionHeading>
        <p className="section-description">Gira... y responde con el corazón</p>
        <div className="wheel-stage">
          <span className="wheel-pointer" aria-hidden="true" />
          <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
            {wheelOptions.map((option, index) => (
              <span
                className="wheel-label"
                key={option}
                style={{ '--label-angle': `${index * 60}deg` } as CSSProperties}
              >
                {option}
              </span>
            ))}
            <span className="wheel-center" aria-hidden="true">♥</span>
          </div>
        </div>
        <button className="spin-button" type="button" onClick={spinWheel} disabled={spinning}>
          {spinning ? 'Girando…' : 'Girar'}
        </button>
        <p className={`wheel-result ${wheelResult ? 'is-visible' : ''}`} aria-live="polite">
          {wheelResult ? `Hoy el corazón eligió: ${wheelResult} ♥` : 'Puedes girar las veces que quieras 🤍'}
        </p>
      </section>

      <section className="section-shell capsule-section" aria-labelledby="capsule-title">
        <div className={`glass-card time-capsule ${capsuleCountdown.unlocked ? 'is-unlocked' : ''}`}>
          <SectionHeading eyebrow="Para nuestro futuro" id="capsule-title">Cápsula del tiempo</SectionHeading>
          <div className="capsule-lock" aria-hidden="true"><span>♥</span></div>

          {!capsuleCountdown.unlocked ? (
            <>
              <p className="capsule-intro">Hay palabras que merecen esperar el momento perfecto.</p>
              <time dateTime="2026-11-29T00:00:00-04:00">Se abrirá el 29 de noviembre de 2026</time>
              <div className="capsule-countdown" aria-label="Tiempo restante para abrir la cápsula" aria-live="polite">
                <div><strong>{capsuleCountdown.days}</strong><span>Días</span></div>
                <div><strong>{String(capsuleCountdown.hours).padStart(2, '0')}</strong><span>Horas</span></div>
                <div><strong>{String(capsuleCountdown.minutes).padStart(2, '0')}</strong><span>Min</span></div>
                <div><strong>{String(capsuleCountdown.seconds).padStart(2, '0')}</strong><span>Seg</span></div>
              </div>
              <p className="capsule-status"><span aria-hidden="true">✦</span> El tiempo está guardando este mensaje para nosotros</p>
            </>
          ) : !capsuleOpen ? (
            <div className="capsule-ready">
              <p className="script">La espera terminó. Este mensaje ya es nuestro.</p>
              <button type="button" onClick={() => setCapsuleOpen(true)}>Abrir cápsula</button>
            </div>
          ) : (
            <article className="capsule-message">
              <p className="eyebrow">Un mensaje desde nuestro pasado</p>
              <p className="script">
                Si estás leyendo esto, llegamos juntos a otro aniversario. Gracias por seguir siendo
                mi lugar favorito, mi calma y mi aventura. Quiero seguir eligiéndote en cada versión
                de nosotros. Te amo, Lisbeth.
              </p>
              <p className="script capsule-signature">Algenis</p>
              <button type="button" onClick={() => setCapsuleOpen(false)}>Cerrar con amor</button>
            </article>
          )}
        </div>
      </section>

      <section className="section-shell final-section" aria-labelledby="final-title">
        <figure
          className="crop-photo final-photo final-photo--uploaded"
          style={{ aspectRatio: '3 / 4', '--photo-rotation': '1.5deg' } as CSSProperties}
        >
          <div className="crop-photo__viewport">
            <img src="/memories/final-kiss.png" alt="Algenis y Lisbeth besándose bajo las luces" loading="lazy" />
          </div>
        </figure>
        <div className="final-copy" id="final-title">
          <p className="script">Lisbeth,</p>
          <p className="script">por todo lo que somos.</p>
          <p className="script soft">Te amo.</p>
        </div>
        <div className="dedication">
          <span />
          <p className="eyebrow">Con cariño</p>
          <span />
        </div>
        <p className="script signature">Algenis</p>
        <p className="forever">♥&nbsp;&nbsp; Para siempre &nbsp;&nbsp;♥</p>
      </section>

      {activeVoucher !== null && (
        <div className="modal-backdrop" onClick={() => setActiveVoucher(null)}>
          <article
            className="romantic-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="voucher-message-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-hearts" aria-hidden="true">
              <span>♥</span><span>♥</span><span>♥</span><span>♥</span><span>♥</span>
            </div>
            <p className="eyebrow">Vale romántico canjeado</p>
            <span className="modal-heart" aria-hidden="true">♥</span>
            <h2 id="voucher-message-title">{vouchers[activeVoucher]}</h2>
            <p>{voucherMessages[activeVoucher]}</p>
            <button type="button" onClick={() => setActiveVoucher(null)}>Guardar este momento</button>
          </article>
        </div>
      )}

      {wheelRevealOpen && wheelResult && (
        <div className="modal-backdrop" onClick={() => setWheelRevealOpen(false)}>
          <article
            className="romantic-modal wheel-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wheel-message-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-hearts" aria-hidden="true">
              <span>♥</span><span>♥</span><span>♥</span><span>♥</span><span>♥</span>
            </div>
            <p className="eyebrow">El corazón eligió</p>
            <span className="modal-heart" aria-hidden="true">♥</span>
            <h2 id="wheel-message-title">{wheelResult}</h2>
            <p>{wheelMessages[wheelResult]}</p>
            <button type="button" onClick={() => setWheelRevealOpen(false)}>Aceptamos el plan</button>
          </article>
        </div>
      )}
        </div>
      )}
    </main>
  )
}

export default App
