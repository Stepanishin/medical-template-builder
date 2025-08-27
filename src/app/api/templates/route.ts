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

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const templates = await Template.find({}).sort({ name: 1 });
    
    return NextResponse.json(templates);
  } catch (error) {
    console.error('GET templates error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const template = new Template({
      name: name.trim(),
      content,
      variables: variables || [],
    });

    await template.save();
    
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('POST template error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}