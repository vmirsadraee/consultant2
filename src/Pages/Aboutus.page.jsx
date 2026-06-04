import React from 'react';
import aboutImg from "../assets/images/about.png";

const Aboutuspage = () => {
    return (
    <div className="container">
      <div className="row">
        <div className="col-12 bg-info p--3 rounded">
          <h3>About us</h3>
        </div>
      </div>
      <div className="row align-items-center">
        <div className="col-md-7">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum tenetur dolores facilis tempore facere, alias
          deserunt eum dolore quos unde quae libero vel magnam, ipsum reiciendis ducimus, quam aliquid natus. Aperiam
          fugiat repudiandae voluptate dignissimos cum placeat unde fuga asperiores voluptatum eaque veniam odio
          incidunt expedita magni, quod corrupti quisquam suscipit ab quas voluptatem, dolorum rem nam tenetur. Ratione
          iusto quidem ullam! Natus dolorum voluptatibus magnam, ex provident iste. Accusamus nemo aperiam est obcaecati
          quasi? Ipsum assumenda reiciendis ratione molestiae obcaecati veritatis quasi impedit mollitia, minima
          cupiditate totam deserunt? Amet totam cum fugit possimus minima doloribus iste provident fuga dolorem.
        </div>
        <div className="col-md-4 text-center">
          <img src={aboutImg} alt="about" className="img-fluid about-img" />
        </div>
      </div>
    </div>
  );
};

export default Aboutuspage;