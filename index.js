import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';

import fs from 'fs';
import crypto from 'crypto';
import http from 'http';

import appSrc from './app.js';

const app = appSrc(express, bodyParser, fs, crypto, http, MongoClient);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server is up!');
});