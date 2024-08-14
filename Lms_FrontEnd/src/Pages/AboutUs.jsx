import mainimg from "../Assets/Images/main.jpg"
import CarouselSlide from '../Components/CarouselSlide';
import celebreties from '../Constands/CarouselConstants';
import HomeLayout from "../Layouts/HomeLayout";
function AboutUs() {
  return (
    <HomeLayout>
      <div className="pl-20 pt-20 flex flex-col text-white">
        <div className="flex items-center gap-5 mx-10">
          <section className="w-1/2">
            <h1 className="text-5xl text-yellow-500 font-semibold">
              Affordable and quality education
            </h1>
            <p className="text-xl text-gray-200">
              Our goal is to provide affordable and quality education to the
              world. We are providing the platform for the aspiring teachers and
              students to share their skills, creativity and knowledge to each
              to empower and contribute in the growth and wellness of manlind.
            </p>
          </section>
          <div className="w-1/2 ml-6">
            <img
              id="test"
              style={{ filter: "drop-shadow(0px 10px 10px rgb(20, 119, 184))"}}
              className="drop-shadow-2xl"
              src={mainimg}
              alt="about img"
            />
          </div>
        </div>
        <div className="carousel w-1/2 my-16 mx-auto">
            {celebreties && celebreties.map((celebrety)=>
            <CarouselSlide {...celebrety} key={celebrety.slideNo} totalSlideNo={celebreties.length}/>)}
        </div>
      </div>
    </HomeLayout>
  );
}

export default AboutUs;
