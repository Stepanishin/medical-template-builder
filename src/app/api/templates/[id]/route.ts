import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Template, { ITemplate } from '@/models/Template';
import { verifyToken } from '@/lib/auth';

async function checkAuth(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token || !verifyToken(token)) {
    return false;
  }
  return true;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthenticated = await checkAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const { name, content, variables }: ITemplate = await request.json();

    if (!name || !content) {
      return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });
    }

    const resolvedParams = await params;
    const template = await Template.findByIdAndUpdate(
      resolvedParams.id,
      {
        name: name.trim(),
        content,
        variables: variables || [],
      },
      { new: true }
    );

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('PUT template error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthenticated = await checkAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const resolvedParams = await params;
    const template = await Template.findByIdAndDelete(resolvedParams.id);

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE template error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}