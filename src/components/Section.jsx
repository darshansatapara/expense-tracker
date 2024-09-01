import React from "react";
import "../css/Section.css";
function Section() {
  return (
    <>
      <div className="section-main">
        <div className="row mt-4 ">
          {/* First two cards on the left side */}
          {/* For cash */}
          <div className="col-md-6 d-flex flex-column align-items-center">
            <h6 className="font-roboto">Cash Payment</h6>
            <div className="card custom-card mb-4">
              <div className="card-body">
                <h5 className="card-title">Income</h5>
              </div>
            </div>
            <div className="card custom-card">
              <div className="card-body">
                <h5 className="card-title">Outcome</h5>
              </div>
            </div>
          </div>
          {/* Next two cards on the right side */}
          {/* For Online Payment */}
          <div className="col-md-6 d-flex flex-column align-items-center">
            <h6 className="font-roboto">Online Payment</h6>
            <div className="card custom-card mb-4">
              <div className="card-body">
                <h5 className="card-title">Income</h5>
              </div>
            </div>
            <div className="card custom-card">
              <div className="card-body">
                <h5 className="card-title">Outcome</h5>
              </div>
            </div>
          </div>
        </div>
        <div class="box custom-box p-3 d-flex justify-content-between align-items-center">
          <span>Last Day Expense</span>
          <button class="btn btn-primary">→</button>
        </div>
  <div class="container mt-5">
        <div class="row">
      <div class="col-md-6 mb-4"> 
        <div class="box bg-light p-3 shadow-sm rounded">
          <h5>Total of last Month</h5>
        </div>
      </div>
      <div class="col-md-6 mb-4">
        <div class="box bg-light p-3 shadow-sm rounded">
          <h5>Total of Year</h5>
        </div>
      </div>
    </div>
    </div>
      </div>
    </>
  );
}

export default Section;
