import React from 'react';

const RequestTable = ({request,index}) => {
    const {requestDate,foodName,expiredDate,donnerName,status}=request;
    
    // Helper logic for the DaisyUI steps component
    const getStepClass = (stepName) => {
        const flow = ['requested', 'accepted', 'picked up', 'delivered'];

        if (status === 'rejected') {
             return stepName === 'requested' ? 'step step-primary' : 'step step-error'; 
        }

        const currentIndex = flow.indexOf(status?.toLowerCase() || 'requested');
        const stepIndex = flow.indexOf(stepName);
        
        return stepIndex <= currentIndex ? 'step step-primary' : 'step';
    };

    return (
      <React.Fragment>
        <tr className="bg-base-200">
          <th>{index+1}</th>
          <td className="font-bold">{donnerName}</td>
          <td>{foodName}</td>
          <td>{expiredDate}</td>
          <td>{requestDate}</td>
        </tr>
        <tr>
          <td colSpan="5" className="p-4 bg-base-100 border-b-2">
            <div className="w-full">
               <ul className="steps w-full text-xs md:text-sm">
                  <li className={getStepClass('requested')}>Requested</li>
                  {status === 'rejected' ? (
                      <li className={getStepClass('rejected')} data-content="✕">Rejected</li>
                  ) : (
                      <>
                        <li className={getStepClass('accepted')}>Accepted</li>
                        <li className={getStepClass('picked up')}>Picked up</li>
                        <li className={getStepClass('delivered')}>Delivered</li>
                      </>
                  )}
               </ul>
            </div>
          </td>
        </tr>
      </React.Fragment>
    );
};

export default RequestTable;