// ========================================
// PELUDOS LOS PEDROCHES – CONFIGURACIÓN
// ========================================
const SUPABASE_URL = 'https://grknhpyouzhmhqpjjomg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya25ocHlvdXpobWhxcGpqb21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDQ0NTQsImV4cCI6MjA5MjI4MDQ1NH0.z2z_eP7DCj_s-JY-ewzZ7RYXGZ0TgAOKzK4HxyoOeic';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
console.log('✅ Supabase inicializado');

// Variables globales
let dogs = [];
let blogPosts = [];
let settings = {};

// Variables del carrusel
let currentDogImages = [];
let currentImageIndex = 0;
