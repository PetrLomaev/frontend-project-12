/* eslint-disable */

const BuildPage = (index) => (
  <>
    <h3>Page {index}</h3>
    <div>
      Something text {index}
    </div>
  </>
);

export const PageOne = () => BuildPage(1);
export const PageTwo = () => BuildPage(2);