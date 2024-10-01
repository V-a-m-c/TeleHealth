import React, { useState } from "react";
import "../aboutPage.css"; // Import your CSS file

const AboutPage = () => {
  const pageStyles = {
    minHeight: "calc(100vh - 4rem)", 
    overflow: "hidden", 
    paddingTop: "4rem", 
  };

  const [currentPage, setCurrentPage] = useState(1); // State to manage current page

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="flex flex-wrap items-center">
            <div className="xl:w-1/2 lg:w-1/2 md:w-full px-6 mb-8 order-2 md:order-1">
              <h2 className="text-lg sm:text-xl font-medium title-font mb-2">
                Schedule Meeting
              </h2>
              <p className="leading-relaxed text-base mb-4">
                The Schedule Meeting facilitates scheduling video conferences
                between doctors and patients on a telehealth website. Users can
                enter a unique Room ID, specify the doctor and patient names,
                choose a date and time for the meeting, and submit the details.
                Validation ensures all fields are filled and that the meeting
                time is in the future. Meetings are stored locally and updated
                periodically. This component integrates seamlessly with the
                website's telehealth functionality, enhancing patient-doctor
                communication and appointment management.
              </p>
            </div>
            <div className="xl:w-1/2 lg:w-1/2 md:w-full px-10 mb-8 order-4 md:order-2">
              <img
                src="https://www.pngitem.com/pimgs/m/200-2005082_schedule-clipart-meeting-schedule-hd-png-download.png"
                alt="Schedule Meeting"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-wrap items-center">
            <div className="xl:w-1/2 lg:w-1/2 md:w-full px-15 mb-8 order-1 md:order-3">
              <img
                src="https://i0.wp.com/www.ratnatechnology.com/wp-content/uploads/2021/08/Appoinment-Booking.png?fit=540%2C625&ssl=1"
                alt="Appointment Booking"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
            <div className="xl:w-1/2 lg:w-1/2 md:w-full px-6 mb-8 order-3 md:order-4">
              <h2 className="text-lg sm:text-xl font-medium title-font mb-2">
                Appointment Booking
              </h2>
              <p className="leading-relaxed text-base mb-4">
                The Booking Appointments provides patients with an overview of
                their current and past appointments on a telehealth platform. It
                retrieves appointments from Firestore based on the current
                user's email, displaying essential details such as doctor's
                name, patient's age and location, appointment mode
                (online/offline), date, time, and status. Patients can view
                appointment details including the doctor's name, date, time,
                and current status. For offline appointments, patients can
                click the "Locate" button to open Google Maps and view the
                doctor's location based on latitude and longitude coordinates
                stored in the appointment data. The component ensures a clear
                and organized display of booking information, enhancing patient
                experience and engagement with the telehealth service.
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-wrap items-center">
            <div className="xl:w-1/2 lg:w-1/2 md:w-full px-6 mb-8 order-2 md:order-1">
              <h2 className="text-lg sm:text-xl font-medium title-font mb-2">
                Available Doctors
              </h2>
              <p className="leading-relaxed text-base mb-4">
                - Patients can view a list of doctors accepted by the admin.
                <br />
                - Patients can select a doctor based on their needs.
                <br />
                - Patients can book an appointment with their chosen doctor.
              </p>
            </div>
            <div className="xl:w-1/2 lg:w-1/2 md:w-full px-10 mb-8 order-4 md:order-2">
              <img
                src="https://sc04.alicdn.com/kf/U3db117176e5048109d53049785397510I.png"
                alt="Available Doctors"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-wrap items-center">
            <div className="xl:w-1/2 lg:w-1/2 md:w-full px-15 mb-8 order-1 md:order-3">
              <img
                src="https://5.imimg.com/data5/SELLER/Default/2022/8/BW/VO/IM/114681272/online-doctor-appointment-application-1000x1000.png"
                alt="Book Appointment"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
            <div className="xl:w-1/2 lg:w-1/2 md:w-full px-6 mb-8 order-3 md:order-4">
              <h2 className="text-lg sm:text-xl font-medium title-font mb-2">
                Book Appointment
              </h2>
              <p className="leading-relaxed text-base mb-4">
                - Patients click on "Book Appointment".
                <br />
                - Fill in the form with name, age, date, time, and mode (online or offline).
                <br />
                - Submit the form to send it to the selected doctor.
              </p>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-wrap items-center">
            <div className="xl:w-1/2 lg:w-1/2 md:w-full px-6 mb-8 order-2 md:order-1">
              <h2 className="text-lg sm:text-xl font-medium title-font mb-2">
                Appointments
              </h2>
              <p className="leading-relaxed text-base mb-4">
                - Doctors receive online and offline appointment forms.
                <br />
                - Doctors approve or reject based on availability.
                <br />
                - Approved appointments are scheduled; rejected ones prompt patients to reapply.
              </p>
            </div>
            <div className="xl:w-1/2 lg:w-1/2 md:w-full px-10 mb-8 order-4 md:order-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4088/4088034.png"
                alt="Appointments"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="flex flex-wrap items-center">
            <div className="xl:w-1/2 lg:w-1/2 md:w-full px-15 mb-8 order-1 md:order-3">
              <img
                src="https://img.freepik.com/premium-photo/2023-march-calendar-black-background_775074-432.jpg?size=626&ext=jpg&ga=GA1.1.1141335507.1719273600&semt=ais_user"
                alt="Online Schedule"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
            <div className="xl:w-1/2 lg:w-1/2 md:w-full px-6 mb-8 order-3 md:order-4">
              <h2 className="text-lg sm:text-xl font-medium title-font mb-2">
                Online Schedule
              </h2>
              <p className="leading-relaxed text-base mb-4">
                - For video conferences, doctors schedule meetings online.
                <br />
                - Doctors fill out the schedule form with details.
                <br />
                - Meetings are set up in the Schedule Meet section.
              </p>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="flex flex-wrap items-center">
            <div className="xl:w-1/2 lg:w-1/2 md:w-full px-6 mb-8 order-2 md:order-1">
              <h2 className="text-lg sm:text-xl font-medium title-font mb-2">
                Schedule Meet
              </h2>
              <p className="leading-relaxed text-base mb-4">
                - Doctors enter Room ID, names, date, and time.
                <br />
                - Submit to schedule the meeting.
                <br />
                - The meeting details are updated in the Conference section.
              </p>
            </div>
            <div className="xl:w-1/2 lg:w-1/2 md:w-full px-10 mb-8 order-4 md:order-2">
              <img
                src="https://us.123rf.com/450wm/honzahruby/honzahruby1312/honzahruby131200022/24380277-vector-business-meeting-icon-with-pictograms-of-people-around-table-flat-design-infographics.jpg?ver=6"
                alt="Schedule Meet"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        );
      case 8:
        return (
          <div className="flex flex-wrap items-center">
            <div className="xl:w-1/2 lg:w-1/2 md:w-full px-15 mb-8 order-1 md:order-3">
              <img
                src="https://png.pngtree.com/png-vector/20190330/ourmid/pngtree-vector-meeting-icon-png-image_894825.jpg"
                alt="Conference"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
            <div className="xl:w-1/2 lg:w-1/2 md:w-full px-6 mb-8 order-3 md:order-4">
              <h2 className="text-lg sm:text-xl font-medium title-font mb-2">
                Conference
              </h2>
              <p className="leading-relaxed text-base mb-4">
                - Accessible by both doctors and patients.
                <br />
                - Scheduled meetings are visible.
                <br />
                - Doctors can reschedule; patients can only join at the set time.
                <br />
                - Meeting expires 10 minutes after the scheduled time.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="text-white body-font bg-black" style={pageStyles}>
      <div className="container px-5 py-12 mx-auto">
        <div className="flex flex-col text-center w-full mb-10">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4">
            About Our Telehealth Service
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            Our telehealth service offers seamless scheduling and management of video conferences between doctors and patients.
          </p>
        </div>

        {renderContent()} {/* Render content based on currentPage */}

        {/* Pagination buttons */}
        <div className="join grid grid-cols-2 mt-6">
          <button
            className={`button button-blue ${currentPage === 1 ? 'button-disabled' : ''}`}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className={`button button-green ${currentPage === 8 ? 'button-disabled' : ''}`}
            onClick={handleNextPage}
            disabled={currentPage === 8}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
