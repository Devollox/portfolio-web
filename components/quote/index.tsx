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
    <div className={styles.wrapper_error_page}>
      <a>{title}</a>

      <blockquote cite="http://www.aaronsw.com/weblog/visitingmit">
        <p>{quote}</p>
        <footer id="effectQuote">— {author}</footer>
      </blockquote>
    </div>
  )
}

export default Quote
