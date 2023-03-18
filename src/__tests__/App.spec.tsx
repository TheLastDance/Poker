import { render, fireEvent } from '@testing-library/react';
import App from '../App';
import formStore from '../mobX/formStore';

describe("Rendering components", () => {

  it('renders App', async () => {
    const { container } = render(<App />);
    const mainDiv = container.querySelector(".App")
    expect(mainDiv).toBeInTheDocument();
  });

  // it('should spy on console log', () => {
  //   const spy = jest.spyOn(console, "log");
  //   const { getByRole } = render(<App />);
  //   const button = getByRole("button", { name: "TEST" });

  //   expect(button).toBeInTheDocument();
  //   fireEvent.click(button);
  //   expect(spy).toBeCalledTimes(1);
  // });

  it('should close form on start button', () => {
    const { getByRole } = render(<App />);
    const button = getByRole("button", { name: "START" });

    fireEvent.click(button);
    expect(formStore.isStarted).toBe(true);
    expect(button).not.toBeInTheDocument();
  })

});

