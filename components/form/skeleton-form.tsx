import cn from 'classnames'
import style from './skeleton-form.module.scss'

const SkeletonForm = () => {
  return (
    <div className={style.form_wrapper}>
      <div className={style.wrapper}>
        <span className={style.name_user}></span>
        <div className={cn(style.signature_wrapper, style.shimmer)}></div>
      </div>
    </div>
  )
}

export default SkeletonForm
