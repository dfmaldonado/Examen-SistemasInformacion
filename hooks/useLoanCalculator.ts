import { useState } from 'react';


export interface LoanParams {
  monto: number;    
  tasaInteres: number; 
  plazo: number;       
  fechaDesembolso: Date;
  comisionPorcentaje?: number; 
}

export interface AmortizationRow {
  noCuota: number;
  fecha: string;
  dias: number;
  interes: number;
  abonoPrincipal: number;
  svsd: number;
  cuotaSinSvsd: number;
  cuotaConSvsd: number;
  saldoPrincipal: number;
}

export const useLoanCalculator = () => {
  const [plan, setPlan] = useState<AmortizationRow[]>([]);
  const [cuotaNivelada, setCuotaNivelada] = useState<number>(0);

  const calcularPrestamo = (params: LoanParams) => {
    const { monto, tasaInteres, plazo, fechaDesembolso, comisionPorcentaje = 0 } = params;

    //Calculo del monto y monto a financiar
    const comision = monto * (comisionPorcentaje / 100);
    const montoFinanciar = monto + comision;

    //Calculo de la tasa mensual
    const divisorTasa = (360 * 12) / 365;
    const i = (tasaInteres / 100) / divisorTasa;

    //Calculo de la tasa nivelada
    const factor = Math.pow(1 + i, -plazo);
    const cuotaCalculada = (montoFinanciar * i) / (1 - factor);
    
   //Redondear decimales
    const cuotaFinal = Math.round(cuotaCalculada * 100) / 100;
    setCuotaNivelada(cuotaFinal);

    //Generar tabla de amortización
    let saldoActual = montoFinanciar;
    let fechaAnterior = new Date(fechaDesembolso);
    const nuevoPlan: AmortizationRow[] = [];

    //Nuevo plan 
    nuevoPlan.push({
      noCuota: 0,
      fecha: fechaAnterior.toISOString().split('T')[0],
      dias: 0,
      interes: 0,
      abonoPrincipal: 0,
      svsd: 0,
      cuotaSinSvsd: 0,
      cuotaConSvsd: 0,
      saldoPrincipal: montoFinanciar
    });

    for (let mes = 1; mes <= plazo; mes++) {

      // Calcular siguiente fecha de pago
      const fechaPago = new Date(fechaAnterior);
      fechaPago.setMonth(fechaPago.getMonth() + 1);

      // Calcular días exactos entre fechas para el cálculo de interés
      const diffTime = Math.abs(fechaPago.getTime() - fechaAnterior.getTime());
      const diasMes = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      // Interes del mes
      const interesMes = saldoActual * (tasaInteres / 100 / 360) * diasMes;

      let abonoPrincipal = cuotaFinal - interesMes;

      // Calculo de Seguro de vida
      let svsd = saldoActual * 0.0015;
      if (svsd < 2) svsd = 2;

      //Saldo principal nuevo
      if (mes === plazo) {
         abonoPrincipal = saldoActual; 
      }
      
      const nuevoSaldo = saldoActual - abonoPrincipal;

      //Cuota total
      const cuotaTotal = cuotaFinal + svsd;

      nuevoPlan.push({
        noCuota: mes,
        fecha: fechaPago.toISOString().split('T')[0],
        dias: diasMes,
        interes: Number(interesMes.toFixed(2)),
        abonoPrincipal: Number(abonoPrincipal.toFixed(2)),
        svsd: Number(svsd.toFixed(2)),
        cuotaSinSvsd: Number(cuotaFinal.toFixed(2)),
        cuotaConSvsd: Number(cuotaTotal.toFixed(2)),
        saldoPrincipal: Number(nuevoSaldo.toFixed(2))
      });

      saldoActual = nuevoSaldo;
      fechaAnterior = fechaPago;
    }

    setPlan(nuevoPlan);
  };

  return {
    calcularPrestamo,
    plan,
    cuotaNivelada
  };
  
};