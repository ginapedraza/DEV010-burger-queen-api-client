import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import OrderList from "./OrderList";
import { updateFinalizedOrder } from "../../services/request";
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
  }));

jest.mock('../../services/request', () => ({
    getOrders: jest.fn(() => Promise.resolve(
      {
        ok: 'ok',
        json: () => Promise.resolve(
          [{
            "client": "Camila",
            "table": "Mesa 4",
            "products": [
              {
                "id": 2,
                "name": "Café con Leche",
                "price": 3200,
                "qty": 1,
                "pricetotal": 3200,
                "image": "https://raw.githubusercontent.com/ginapedraza/burger-queen-api-mock/main/resources/images/producto-cafe-con-leche.png",
                "type": "Breakfast",
                "dateEntry": "2022-03-05 15:14:10"
              }
            ],
            "dateEntry": "1:37 PM",
            "id": 29,
            "status": "Por entregar",
            "dateFinal": "1:52 PM"
          }],
        )
      }
    )),
    updateFinalizedOrder: jest.fn(() => Promise.resolve()),
  }));

  describe('OrderList component', () => {
    beforeAll(() => {
      localStorage.setItem('token', 'token')
    })
    it('should show Entregar Button', async () => {
      render(<MemoryRouter><OrderList /></MemoryRouter>)
      await waitFor(() => {
        expect(screen.getByText('Entregar')).toBeInTheDocument();
      })
    });
    it('should change the status to Entregado and deletes the buttom', async () => {
        render(<MemoryRouter><OrderList /></MemoryRouter>)
      // Esperar hasta que se muestre el botón 'Finalizar'
      await waitFor(() => {
        expect(screen.getByText('Entregar')).toBeInTheDocument();
        
      });
      // Esperar hasta que se haga clic en el botón 'Finalizar'
      //fireEvent.click(screen.getByText('Finalizar'));
      const button = screen.getByRole('button', { name: 'Entregar' })
      screen.debug(button);
      
      fireEvent.click(button)
      //console.log(document.body.innerHTML);
      await waitFor(() => expect(updateFinalizedOrder).toHaveBeenCalledTimes(1));
      // Esperar hasta que se muestre el elemento con data-testid 'total-time'
      /* const timeElement = await screen.findByTestId('total-time');
      // Realizar las aserciones
      expect(timeElement.textContent).toBe('Tiempo: 0 horas y 15 minutos'); */
    });
  })