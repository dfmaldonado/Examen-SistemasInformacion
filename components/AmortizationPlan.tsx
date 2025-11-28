import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AmortizationRow } from '../hooks/useLoanCalculator';

interface Props {
  plan: AmortizationRow[];
  cuotaBase: number;
}

const AmortizationPlan: React.FC<Props> = ({ plan, cuotaBase }) => {
  if (plan.length === 0) return null;

  const renderItem = ({ item }: { item: AmortizationRow }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, {width: 40}]}>{item.noCuota}</Text>
      <Text style={[styles.cell, {width: 90}]}>{item.fecha}</Text>
      <Text style={styles.cell}>{item.dias}</Text>
      <Text style={styles.cell}>{item.interes.toFixed(2)}</Text>
      <Text style={styles.cell}>{item.abonoPrincipal.toFixed(2)}</Text>
      <Text style={styles.cell}>{item.svsd.toFixed(2)}</Text>
      <Text style={[styles.cell, {fontWeight: 'bold'}]}>{item.cuotaConSvsd.toFixed(2)}</Text>
      <Text style={styles.cell}>{item.saldoPrincipal.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Plan de Amortización</Text>
      <Text style={styles.subHeader}>Cuota Nivelada Base: {cuotaBase}</Text>
      
      <ScrollView horizontal>
        <View>
          {/* Encabezados de Tabla */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerText, {width: 40}]}>No</Text>
            <Text style={[styles.cell, styles.headerText, {width: 90}]}>Fecha</Text>
            <Text style={[styles.cell, styles.headerText]}>Días</Text>
            <Text style={[styles.cell, styles.headerText]}>Interés</Text>
            <Text style={[styles.cell, styles.headerText]}>Abono</Text>
            <Text style={[styles.cell, styles.headerText]}>SVSD</Text>
            <Text style={[styles.cell, styles.headerText]}>Total</Text>
            <Text style={[styles.cell, styles.headerText]}>Saldo</Text>
          </View>

          <FlatList
            data={plan}
            keyExtractor={(item) => item.noCuota.toString()}
            renderItem={renderItem}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  subHeader: { fontSize: 14, textAlign: 'center', marginBottom: 10, color: '#555' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 8 },
  headerRow: { backgroundColor: '#f0f0f0', borderTopWidth: 1, borderTopColor: '#ccc' },
  cell: { width: 70, textAlign: 'center', fontSize: 12 },
  headerText: { fontWeight: 'bold', fontSize: 11 }
});

export default AmortizationPlan;