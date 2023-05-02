import { render, fireEvent } from '@testing-library/react';
import formStore from '../mobX/formStore';
import Form from '../components/React/form/form';

describe("Rendering components", () => {

  it('renders Form', () => {
    const { container } = render(<Form />);
    const mainDiv = container.querySelector(".form_container");
    expect(mainDiv).toBeInTheDocument();
  });

  it('should close form on start button', () => {
    const { getByRole } = render(<Form />);
    const button = getByRole("button", { name: "START" });

    fireEvent.click(button);
    expect(formStore.isStarted).toBe(true);
  })

});

