import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const csvFile = formData.get('csvFile') as File;
    
    if (!csvFile) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'File CSV diperlukan' 
        },
        { status: 400 }
      );
    }

    // Read CSV file
    const csvText = await csvFile.text();
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'File CSV harus memiliki header dan minimal 1 baris data' 
        },
        { status: 400 }
      );
    }

    // Parse CSV header
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Validate required headers
    const requiredHeaders = ['flight_number', 'airline', 'departure_time', 'arrival_time', 'aircraft_type'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Header yang diperlukan: ${missingHeaders.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Parse CSV data
    const trafficData = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length !== headers.length) {
        continue; // Skip malformed rows
      }

      const rowData: Record<string, string | null> = {};
      headers.forEach((header, index) => {
        rowData[header] = values[index] || null;
      });

      // Convert passengers to number if present
      const passengersValue = rowData.passengers ? parseInt(rowData.passengers) || null : null;

      trafficData.push({
        flight_number: rowData.flight_number,
        airline: rowData.airline,
        departure_time: rowData.departure_time,
        arrival_time: rowData.arrival_time,
        aircraft_type: rowData.aircraft_type,
        route: rowData.route || null,
        passengers: passengersValue,
      });
    }

    if (trafficData.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tidak ada data valid yang dapat diproses' 
        },
        { status: 400 }
      );
    }

    // Insert data to database
    const result = await prisma.trafficFlight.createMany({
      data: trafficData,
      skipDuplicates: true
    });

    return NextResponse.json(
      { 
        success: true, 
        message: `berhasil input ${result.count} data traffic flight`,
        count: result.count
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing traffic flight CSV:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Gagal memproses file CSV',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const trafficFlightData = await prisma.trafficFlight.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: trafficFlightData
    });
  } catch (error) {
    console.error('Error fetching traffic flight data:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Gagal mengambil data traffic flight',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
