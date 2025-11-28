import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

interface LoanFormProps {
  onCalculate: (data: any) => void;
}

const LoanForm: React.FC<LoanFormProps> = ({ onCalculate }) => {
  const [monto, setMonto] = useState('');
  const [tasa, setTasa] = useState('');
  const [plazo, setPlazo] = useState('');
  // Simplificación: fecha fija o usar un DatePicker en una app real
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); 

  const handleSubmit = () => {
    // Validaciones básicas
    if (!monto || !tasa || !plazo) return;

    onCalculate({
      monto: parseFloat(monto),
      tasaInteres: parseFloat(tasa),
      plazo: parseInt(plazo),
      fechaDesembolso: new Date(fecha),
      comisionPorcentaje: 0
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculadora de Préstamos</Text>
      
      <Text>Monto del Préstamo (Monto a Financiar)</Text>
      <TextInput 
        style={styles.input} 
        keyboardType="numeric" 
        value={monto} 
        onChangeText={setMonto} 
        placeholder="Ej: 10000"
      />

      <Text>Tasa de Interés Anual (%)</Text>
      <TextInput 
        style={styles.input} 
        keyboardType="numeric" 
        value={tasa} 
        onChangeText={setTasa} 
        placeholder="Ej: 16"
      />

      <Text>Plazo (Meses)</Text>
      <TextInput 
        style={styles.input} 
        keyboardType="numeric" 
        value={plazo} 
        onChangeText={setPlazo} 
        placeholder="Ej: 12"
      />

      <Button title="Calcular Plan de Pagos" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 }
});

}
export default LoanForm;