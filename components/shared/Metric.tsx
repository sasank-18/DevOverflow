import Image from "next/image"
import Link from "next/link"

interface MetricProps{
    imgUrl : string,
    alt : string,
    value : number|string,
    title: string, 
    href ? : string,
    textStyle? : string,
    isAuthor? : boolean
}

const Metric = ({imgUrl,alt,value,isAuthor, href ,title,textStyle } : MetricProps)=>{

    const metriContent = (
       <>
        <Image
        src= {imgUrl}
        width={16}
        height= {16}
        alt = {alt}
        className = {`object-contain ${href ? "rounded-full" : ""}`}
        />
        <p className={`${textStyle} flex items-center gap-1`}>
            {value}
           <span className={`small-regular line-clamp-1 ${isAuthor ? 'max-sm:hidden' : ''}`}>{title}</span> 
        </p>
        </> 
    )

    if(href){
        return (
            <Link href = {href} className="flex-center gap-1">
                {metriContent}
            </Link>
        )
    }

  return (
    <div className="flex gap-1" >
        {metriContent}
 </div>

  )
}

export default Metric