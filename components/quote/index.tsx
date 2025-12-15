import useEncoding from 'hook/useEncoding'
import styles from './quote.module.scss'

type QuoteProps = {
  title: string
  quote: string
  author: string
}

const Quote = ({ title, quote, author }: QuoteProps) => {
  useEncoding('effectQuote', 25)

  return (
    <section className={styles.wrapper_error_page}>
      <span className={styles.quote_label}>{title}</span>

      <blockquote>
        <p className={styles.quote_text}>{quote}</p>
        <footer id="effectQuote" className={styles.quote_footer}>
          — {author}
        </footer>
      </blockquote>
    </section>
  )
}

export default Quote
