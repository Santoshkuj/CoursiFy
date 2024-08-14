function CarouselSlide({title,quote,image,slideNo,totalSlideNo}) {
    return(
          <div id={`slide${slideNo}`} className="carousel-item relative w-full">
            <div className="flex flex-col items-center justify-center gap-4 m-auto">
            <img
              src={image}
              className="w-60 h-60 rounded-full border-2 border-gray-400"
            />
            <h3 className='text-3xl text-gray-500'>{title}</h3>
            <p className='text-2xl font-semibold'>{quote}</p>
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a href={`#slide${slideNo === 1 ? totalSlideNo : slideNo-1}`} className="btn btn-circle">
                ❮
              </a>
              <a href={`#slide${(slideNo)% totalSlideNo + 1}`} className="btn btn-circle">
                ❯
              </a>
            </div>
            </div>
          </div>
    )
}

export default CarouselSlide;